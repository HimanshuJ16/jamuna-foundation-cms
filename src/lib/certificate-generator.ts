import jsPDF from "jspdf"

interface CertificateData {
  candidateName: string
  domain: string
  startDate: string
  endDate: string
  submissionId: string
  tasksPerformed: string
  email: string
}

// Function to load image from public folder
async function loadImageFromPublic(imagePath: string): Promise<string> {
  try {
    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${imagePath}`

    const response = await fetch(publicUrl)
    if (!response.ok) {
      console.warn(`Could not load image from ${publicUrl}`)
      return ""
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    let mimeType = "image/png"
    if (imagePath.includes(".jpg") || imagePath.includes(".jpeg")) {
      mimeType = "image/jpeg"
    }

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.warn(`Warning: Could not load image ${imagePath}:`, error)
    return ""
  }
}

// Function to generate QR code data URL
function generateQRCodeDataURL(text: string): string {
  // Simple QR code placeholder - you can integrate with a QR code library
  // For now, we'll use a placeholder
  return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(text)}`
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  try {
    console.log("📜 Starting certificate generation with data:", data)

    // Use landscape orientation for certificate
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const centerX = pageWidth / 2
    const margin = 20

    // Load images
    console.log("🖼️ Loading certificate images...")
    const logoBase64 = await loadImageFromPublic("/images/codsoft-logo.png")
    const signatureBase64 = await loadImageFromPublic("/images/signature.png")

    // Load additional certificate elements (you can add these to your public/images folder)
    const msmeLogoBase64 = await loadImageFromPublic("/images/msme-logo.png")
    const govIndiaBase64 = await loadImageFromPublic("/images/gov-india-logo.png")
    const isoBase64 = await loadImageFromPublic("/images/iso-logo.png")

    // Background design elements
    // Top left triangle (blue)
    doc.setFillColor(63, 81, 181) // Blue color
    doc.triangle(0, 0, 60, 0, 0, 40, "F")

    // Bottom right triangle (blue)
    doc.triangle(pageWidth, pageHeight, pageWidth - 60, pageHeight, pageWidth, pageHeight - 40, "F")

    // Top right triangle (light blue)
    doc.setFillColor(144, 202, 249) // Light blue
    doc.triangle(pageWidth, 0, pageWidth - 40, 0, pageWidth, 30, "F")

    // Bottom left triangle (light blue)
    doc.triangle(0, pageHeight, 40, pageHeight, 0, pageHeight - 30, "F")

    // Add main border
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(2)
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

    // Add CodSoft logo (top right)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", pageWidth - 80, 20, 60, 20)
        console.log("✅ Logo added successfully")
      } catch (logoError) {
        console.warn("⚠️ Could not add logo:", logoError)
      }
    }

    // Add C.ID in top left
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`C.ID: ${data.submissionId}`, 20, 25)

    // Main title - CERTIFICATE
    doc.setFontSize(36)
    doc.setFont("Belleza", "normal")
    doc.text("CERTIFICATE", centerX, 60, { align: "center" })

    // Subtitle - OF COMPLETION
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(128, 128, 128) // Gray color
    doc.text("OF COMPLETION", centerX, 75, { align: "center" })

    // PROUDLY PRESENTED TO
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0) // Black
    doc.text("PROUDLY PRESENTED TO", centerX, 90, { align: "center" })

    // Candidate name with underline
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(data.candidateName, centerX, 110, { align: "center" })

    // Underline for name
    const nameWidth = doc.getTextWidth(data.candidateName)
    doc.setLineWidth(1)
    doc.line(centerX - nameWidth / 2, 115, centerX + nameWidth / 2, 115)

    // Main certificate text
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    const mainText1 = `has successfully completed 4 weeks of a virtual internship program in`
    doc.text(mainText1, centerX, 130, { align: "center" })

    // Domain in bold
    doc.setFont("helvetica", "bold")
    doc.text(data.domain, centerX, 145, { align: "center" })

    // Date range
    doc.setFont("helvetica", "normal")
    const dateText = `with wonderful remarks at CODSOFT from ${data.startDate} to ${data.endDate}`
    doc.text(dateText, centerX, 160, { align: "center" })

    // Appreciation text
    const appreciationText = "We were truly amazed by his/her showcased skills and invaluable contributions to"
    doc.text(appreciationText, centerX, 175, { align: "center" })

    const appreciationText2 = "the tasks and projects throughout the internship."
    doc.text(appreciationText2, centerX, 185, { align: "center" })

    // Bottom section with logos and signature
    const bottomY = pageHeight - 60

    // QR Code (left side)
    try {
      const qrCodeUrl = await fetch(generateQRCodeDataURL(`Certificate ID: ${data.submissionId}`))
      if (qrCodeUrl.ok) {
        const qrBlob = await qrCodeUrl.arrayBuffer()
        const qrBase64 = `data:image/png;base64,${Buffer.from(qrBlob).toString("base64")}`
        doc.addImage(qrBase64, "PNG", 30, bottomY - 20, 25, 25)
      }
    } catch (qrError) {
      console.warn("⚠️ Could not add QR code:", qrError)
      // Add placeholder QR code box
      doc.setDrawColor(0, 0, 0)
      doc.rect(30, bottomY - 20, 25, 25)
      doc.setFontSize(8)
      doc.text("QR", 42, bottomY - 7, { align: "center" })
    }

    // Founder signature
    if (signatureBase64) {
      try {
        doc.addImage(signatureBase64, "PNG", 80, bottomY - 15, 40, 15)
        doc.setFontSize(10)
        doc.text("Founder", 100, bottomY + 5, { align: "center" })
        console.log("✅ Signature added successfully")
      } catch (signatureError) {
        console.warn("⚠️ Could not add signature:", signatureError)
      }
    }

    // Award medal icon (center)
    doc.setFillColor(255, 193, 7) // Gold color
    doc.circle(centerX, bottomY - 5, 15, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.text("🏆", centerX, bottomY - 2, { align: "center" })

    // ISO certification badge
    if (isoBase64) {
      try {
        doc.addImage(isoBase64, "PNG", centerX + 40, bottomY - 15, 25, 25)
      } catch (isoError) {
        console.warn("⚠️ Could not add ISO logo:", isoError)
        // Placeholder
        doc.setDrawColor(0, 0, 0)
        doc.circle(centerX + 52, bottomY - 2, 12)
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(8)
        doc.text("ISO", centerX + 52, bottomY - 2, { align: "center" })
      }
    }

    // Government of India emblem
    if (govIndiaBase64) {
      try {
        doc.addImage(govIndiaBase64, "PNG", centerX + 80, bottomY - 15, 20, 25)
      } catch (govError) {
        console.warn("⚠️ Could not add Gov India logo:", govError)
      }
    }

    // MSME logo
    if (msmeLogoBase64) {
      try {
        doc.addImage(msmeLogoBase64, "PNG", centerX + 110, bottomY - 15, 30, 25)
      } catch (msmeError) {
        console.warn("⚠️ Could not add MSME logo:", msmeError)
      }
    }

    // Footer text
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text("contact@codsoft.in", 30, pageHeight - 15)
    doc.text("www.codsoft.in", centerX, pageHeight - 15, { align: "center" })

    const currentDate = new Date().toLocaleDateString("en-GB")
    doc.text(`Date: ${currentDate}`, pageWidth - 30, pageHeight - 15, { align: "right" })

    // Generate PDF buffer
    const pdfArrayBuffer = doc.output("arraybuffer")
    const pdfBuffer = Buffer.from(pdfArrayBuffer)

    console.log("✅ Certificate generated successfully")
    console.log("📊 Certificate size:", pdfBuffer.length, "bytes")

    return pdfBuffer
  } catch (error) {
    console.error("❌ Error generating certificate:", error)
    throw new Error(`Failed to generate certificate: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
