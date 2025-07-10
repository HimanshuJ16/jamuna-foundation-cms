import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(fileBuffer: Buffer, fileName: string): Promise<string> {
  try {
    console.log(`📤 Uploading file to Cloudinary: ${fileName}`)
    console.log(`📊 File size: ${fileBuffer.length} bytes`)

    // Validate buffer
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Invalid or empty file buffer")
    }

    // Convert buffer to base64 data URI with proper PDF mime type
    const base64Data = `data:application/pdf;base64,${fileBuffer.toString("base64")}`

    // Clean filename for public_id (remove special characters but keep structure)
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
    const publicId = cleanFileName.replace(/\.pdf$/i, "") // Remove .pdf extension for public_id

    console.log(`🏷️ Public ID: ${publicId}`)

    // Upload to Cloudinary with proper settings for PDF
    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: "raw", // Use 'raw' for PDF files
      folder: "internship-offer-letters",
      public_id: publicId,
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
    })

    console.log(`✅ File uploaded successfully to Cloudinary`)
    console.log(`📋 Upload result:`, {
      public_id: result.public_id,
      version: result.version,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      secure_url: result.secure_url,
    })

    // Return the direct secure URL - this is used for internal storage
    return result.secure_url
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error)
    throw new Error(`Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Optional: Function to delete files from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    })
    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return false
  }
}

// Test function to verify Cloudinary configuration
export async function testCloudinaryConfig() {
  try {
    const config = cloudinary.config()
    console.log("🔧 Cloudinary config:", {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? "✅ Set" : "❌ Missing",
      api_secret: config.api_secret ? "✅ Set" : "❌ Missing",
    })

    // Test with a simple upload
    const testBuffer = Buffer.from("Test PDF content")
    const testResult = await uploadToCloudinary(testBuffer, "test-file.pdf")

    return { success: true, testUrl: testResult }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function uploadPDFAsImage(fileBuffer: Buffer, fileName: string): Promise<string> {
  try {
    console.log(`📤 Uploading PDF as image to Cloudinary: ${fileName}`)

    const base64Data = `data:application/pdf;base64,${fileBuffer.toString("base64")}`
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
    const publicId = cleanFileName.replace(/\.pdf$/i, "")

    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: "image", // Treat as image
      format: "pdf", // Force PDF format
      folder: "internship-offer-letters",
      public_id: publicId,
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
    })

    console.log(`✅ File uploaded successfully as image to Cloudinary`)
    return result.secure_url
  } catch (error) {
    console.error("❌ Error uploading PDF as image to Cloudinary:", error)
    throw new Error(
      `Failed to upload PDF as image to Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function uploadPDFWithContentType(fileBuffer: Buffer, fileName: string): Promise<string> {
  try {
    console.log(`📤 Uploading PDF with content type to Cloudinary: ${fileName}`)

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
    const publicId = cleanFileName.replace(/\.pdf$/i, "")

    const result = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "internship-offer-letters",
            public_id: publicId,
            use_filename: false,
            unique_filename: false,
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) {
              console.error("❌ Error uploading with stream:", error)
              reject(error)
            } else {
              console.log(`✅ File uploaded successfully with stream to Cloudinary`)
              resolve(result)
            }
          },
        )
        .end(fileBuffer)
    })) as any

    return result.secure_url
  } catch (error) {
    console.error("❌ Error uploading PDF with content type to Cloudinary:", error)
    throw new Error(
      `Failed to upload PDF with content type to Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function testPDFAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error("❌ Error testing PDF accessibility:", error)
    return false
  }
}

export async function uploadPDFToCloudinary(fileBuffer: Buffer, fileName: string): Promise<string> {
  return uploadToCloudinary(fileBuffer, fileName)
}

export function generateCloudinaryDownloadUrl(cloudinaryUrl: string, fileName: string): string {
  // Extract public ID from Cloudinary URL
  const publicId = cloudinaryUrl.substring(cloudinaryUrl.lastIndexOf("/") + 1, cloudinaryUrl.lastIndexOf("."))

  // Construct the download URL
  const downloadUrl = cloudinary.url(publicId, {
    resource_type: "raw",
    format: "pdf",
    secure: true,
  })

  return downloadUrl
}
