const domain =
  process.env.mode === "production"
    ? "https://apiv2.example.com"
    : "http://localhost:3000";

export { domain };
