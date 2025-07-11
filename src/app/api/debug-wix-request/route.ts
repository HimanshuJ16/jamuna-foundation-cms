import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 DEBUG: Wix request received")

    // Log all headers
    console.log("📋 Headers:")
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`)
    })

    const contentType = request.headers.get("content-type") || ""
    console.log("📥 Content-Type:", contentType)

    let rawBody: any = {}
    let bodyText = ""

    try {
      // Get raw body text first
      bodyText = await request.text()
      console.log("📄 Raw body text:", bodyText)
      console.log("📏 Body length:", bodyText.length)

      // Try to parse as JSON
      if (bodyText) {
        rawBody = JSON.parse(bodyText)
        console.log("✅ Successfully parsed as JSON")
        console.log("🔍 Parsed JSON:", JSON.stringify(rawBody, null, 2))
        console.log("🔑 Available keys:", Object.keys(rawBody))

        // Log each field value
        Object.entries(rawBody).forEach(([key, value]) => {
          console.log(`  ${key}: ${typeof value} = ${value}`)
        })
      }
    } catch (parseError) {
      console.log("❌ JSON parse error:", parseError)
      console.log("📄 Raw body (first 500 chars):", bodyText.substring(0, 500))
    }

    return NextResponse.json({
      success: true,
      debug: {
        contentType,
        bodyLength: bodyText.length,
        rawBodyPreview: bodyText.substring(0, 200),
        parsedData: rawBody,
        availableKeys: Object.keys(rawBody),
        fieldTypes: Object.fromEntries(Object.entries(rawBody).map(([key, value]) => [key, typeof value])),
      },
      message: "Debug complete - check Vercel logs for detailed information",
    })
  } catch (error) {
    console.error("❌ Debug error:", error)
    return NextResponse.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
