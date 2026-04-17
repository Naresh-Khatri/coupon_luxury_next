import "dotenv/config";
import { env } from "../lib/env";
import { auth } from "../lib/auth";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;
  const name = env.ADMIN_NAME;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  }

  const [existing] = await db
    .select()
    .from(user)
    .where(eq(user.email, email));

  if (existing) {
    if (existing.role !== "admin") {
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.id, existing.id));
      console.log(`Promoted ${email} to admin.`);
    } else {
      console.log(`Admin ${email} already exists.`);
    }
    return;
  }

  const res = await auth.api.signUpEmail({
    body: { email, password, name },
  });
  if (!res.user) throw new Error("signUp failed");

  await db
    .update(user)
    .set({ role: "admin", emailVerified: true })
    .where(eq(user.id, res.user.id));

  console.log(`Created admin ${email}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
