// Environment variables validation
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
}

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

// Log configuration (without sensitive data)
console.log("🔧 Environment Configuration:")
console.log(`- Database: ${process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing"}`)
console.log(`- Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME ? "✅ Configured" : "❌ Missing"}`)
console.log(`- Cloudinary API Key: ${process.env.CLOUDINARY_API_KEY ? "✅ Configured" : "❌ Missing"}`)
console.log(`- Cloudinary Secret: ${process.env.CLOUDINARY_API_SECRET ? "✅ Configured" : "❌ Missing"}`)
