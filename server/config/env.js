import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "PORT",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "ALLOWED_ORIGINS",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

if (isNaN(process.env.PORT)) {
  console.error("❌ PORT must be a number");
  process.exit(1);
}

const env = {
  PORT: process.env.PORT,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS.split(","),
};

export default env;
