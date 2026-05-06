export function requireEnv(name, { allowEmpty = false } = {}) {
  const value = process.env[name];
  if (!allowEmpty) {
    if (value === undefined || value === null || String(value).trim() === "") {
      const err = new Error(`Missing required environment variable: ${name}`);
      err.statusCode = 500;
      throw err;
    }
  } else {
    if (value === undefined || value === null) {
      const err = new Error(`Missing required environment variable: ${name}`);
      err.statusCode = 500;
      throw err;
    }
  }
  return value;
}

export function validateEnv() {
  // Required
  requireEnv("MONGO_URI");
  requireEnv("JWT_SECRET");

  // Optional / used by email templates
  // If you don't use email features, you can ignore these.
  // requireEnv("GMAILUSER", { allowEmpty: true });
  // requireEnv("PASSCODE", { allowEmpty: true });

  return true;
}

