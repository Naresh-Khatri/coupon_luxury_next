import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Session } from "@/lib/auth";

export type Context = {
  session: Session | null;
  headers: Headers;
};

const isDev = process.env.NODE_ENV !== "production";

function safeMessage(code: TRPCError["code"]) {
  switch (code) {
    case "UNAUTHORIZED":
      return "You must be signed in to do that.";
    case "FORBIDDEN":
      return "You do not have permission to do that.";
    case "NOT_FOUND":
      return "Not found.";
    case "BAD_REQUEST":
      return "Invalid request.";
    case "CONFLICT":
      return "That conflicts with an existing record.";
    case "TOO_MANY_REQUESTS":
      return "Too many requests, please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const zodError =
      error.cause instanceof ZodError ? error.cause.flatten() : null;
    const rawMessage = error.message;
    const rawStack = isDev ? shape.data?.stack : undefined;

    // The `message` field is what clients surface in toasts, so always
    // rewrite it to a user-safe string. Raw driver/db text and stacks are
    // kept in `data` only for dev devtools inspection.
    return {
      ...shape,
      message: zodError ? "Invalid input." : safeMessage(error.code),
      data: {
        ...shape.data,
        stack: rawStack,
        rawMessage: isDev ? rawMessage : undefined,
        zodError,
      },
    };
  },
});

// Wraps any non-TRPCError thrown from a procedure into a generic
// INTERNAL_SERVER_ERROR so raw db / driver messages never reach the client.
// The original error is still logged server-side for debugging.
const errorWrapper = t.middleware(async ({ next, path, type }) => {
  try {
    return await next();
  } catch (err) {
    if (err instanceof TRPCError) throw err;
    console.error(`[trpc] ${type} ${path} failed:`, err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again.",
      cause: err,
    });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure.use(errorWrapper);

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
  return next({ ctx });
});

export const createCallerFactory = t.createCallerFactory;
