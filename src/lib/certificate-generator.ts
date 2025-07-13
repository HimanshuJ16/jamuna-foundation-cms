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

// Function to load the exact template image
async function loadTemplateImage(): Promise<string> {
  try {
    // First try to load from public folder
    const localTemplate = await loadImageFromPublic("/images/certificate-template.jpg")
    if (localTemplate) {
      return localTemplate
    }

    // Fallback to the provided URL
    const templateUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-07-13%20at%2018.03.33_b9779c0c.jpg-DJG1czfr5UFIcrv5zFIaZ0yARPtOj3.jpeg"
    const response = await fetch(templateUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error("Error loading template image:", error)
    throw new Error("Could not load certificate template")
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

    // Define margins and line height for the new text block
    const leftMargin = 50 // Adjust as needed
    const rightMargin = 50 // Adjust as needed
    const lineHeight = 7 // Adjust as needed for spacing between lines

    // Load the exact template image
    console.log("🖼️ Loading certificate template image...")
    const templateBase64 = await loadTemplateImage()

    // Add the template image as background (full page)
    doc.addImage(templateBase64, "JPEG", 0, 0, pageWidth, pageHeight)

    console.log("✅ Template image loaded and applied")

    // Load images
    console.log("🖼️ Loading certificate images...")
    const logoBase64 = await loadImageFromPublic("/images/logo-text.png")
    const signatureBase64 = await loadImageFromPublic("/images/signature.jpg")
    const watermarkBase64 = await loadImageFromPublic("/images/watermark.jpg")

    // Load additional certificate elements (you can add these to your public/images folder)
    // const msmeLogoBase664 = await loadImageFromPublic("/images/msme-logo.png")
    // const govIndiaBase64 = await loadImageFromPublic("/images/gov-india-logo.png")
    // const isoBase64 = await loadImageFromPublic("/images/iso-logo.png")

    // Add CodSoft logo (top right)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", 30, 15, 60, 10)
        console.log("✅ Logo added successfully")
      } catch (logoError) {
        console.warn("⚠️ Could not add logo:", logoError)
      }
    }

    if (watermarkBase64) {
      try {
        doc.addImage(watermarkBase64, "PNG", 18, 15, 10, 10)
        console.log("✅ watermark added successfully")
      } catch (watermarkError) {
        console.warn("⚠️ Could not add watermark:", watermarkError)
      }
    }

    // Add C.ID in top left
    doc.setFontSize(10)
    doc.setFont("Poppins", "bold")
    doc.text(`C.ID: ${data.submissionId}`, centerX + 60, 20, { align: "left" })

    // Main title - CERTIFICATE
    doc.setFontSize(56)
    doc.setFont("Bellefair", "normal")
    doc.text("CERTIFICATE", centerX, 53, { align: "center" })

    // Subtitle - OF COMPLETION
    doc.setFontSize(24)
    doc.setFont("Poppins", "normal")
    doc.text("OF COMPLETION", centerX, 68, { align: "center" })

    // PROUDLY PRESENTED TO
    doc.setFontSize(12)
    doc.setFont("Poppins", "normal")
    doc.setTextColor(0, 0, 0) // Black
    doc.text("THIS IS TO CERTIFY THAT", centerX, 83, { align: "center" })

    // Candidate name with underline
    doc.setFontSize(45)
    doc.setFont("Bellefair", "normal")
    doc.text(data.candidateName, centerX, 103, { align: "center" })

    // Underline for name
    const nameWidth = doc.getTextWidth(data.candidateName)
    doc.setLineWidth(0.3)
    doc.line(centerX - nameWidth / 2, 106, centerX + nameWidth / 2, 106)

    // Main certificate text - Converted to new format with centering
    doc.setFontSize(13) // Set font size for this block

    const paraParts = [
      { text: 'has successfully completed ', style: 'normal' },
      { text: '4 weeks', style: 'bold' },
      { text: ' of a virtual internship program in ', style: 'normal' },
      { text: data.domain, style: 'bold' },
      { text: ' with wonderful remarks at ', style: 'normal' },
      { text: 'JAMUNA FOUNDATION', style: 'bold' },
      { text: ' from ', style: 'normal' },
      { text: data.startDate, style: 'bold' },
      { text: ' to ', style: 'normal' },
      { text: data.endDate, style: 'bold' },
      { text: '. We were truly amazed by his/her showcased skills and invaluable contributions to the tasks and projects throughout the internship.', style: 'normal' },
    ];

    let y = 118; // Starting Y position for this text block
    const maxWidth = pageWidth - leftMargin - rightMargin; // Max width for a line of text

    let currentLine: { text: string; style: string; width: number }[] = [];
    let currentLineTextWidth = 0;

    for (const part of paraParts) {
      const words = part.text.split(' ');
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? ' ' : ''); // Re-add space
        doc.setFont("Poppins", part.style); // Set font to measure word width accurately
        const wordWidth = doc.getTextWidth(word);

        if (currentLineTextWidth + wordWidth > maxWidth && currentLine.length > 0) {
          // Line is full, draw it
          let startX = leftMargin + (maxWidth - currentLineTextWidth) / 2;
          for (const linePart of currentLine) {
            doc.setFont("Poppins", linePart.style);
            doc.text(linePart.text, startX, y);
            startX += linePart.width;
          }
          y += lineHeight; // Move to next line
          currentLine = []; // Reset for new line
          currentLineTextWidth = 0;
        }

        currentLine.push({ text: word, style: part.style, width: wordWidth });
        currentLineTextWidth += wordWidth;
      }
    }

    // Draw any remaining text in the last line
    if (currentLine.length > 0) {
      let startX = leftMargin + (maxWidth - currentLineTextWidth) / 2;
      for (const linePart of currentLine) {
        doc.setFont("Poppins", linePart.style);
        doc.text(linePart.text, startX, y);
        startX += linePart.width;
      }
      y += lineHeight;
    }

    // Bottom section with logos and signature
    const bottomY = pageHeight - 60

    // Founder signature
    // if (signatureBase64) {
    //   try {
    //     doc.addImage(signatureBase64, "PNG", 80, bottomY - 15, 40, 15)
    //     doc.setFontSize(10)
    //     doc.text("Founder", 100, bottomY + 5, { align: "center" })
    //     console.log("✅ Signature added successfully")
    //   } catch (signatureError) {
    //     console.warn("⚠️ Could not add signature:", signatureError)
    //   }
    // }

    // Add signature (if available)
    if (signatureBase64) {
      try {
        doc.addImage(signatureBase64, "PNG", leftMargin, 150, 40, 16) // Signature above "Founder"
        console.log("✅ Signature added successfully")
      } catch (signatureError) {
        console.warn("⚠️ Could not add signature:", signatureError)
      }
    }

    // Footer section
    doc.setFontSize(11)
    doc.setFont("Poppins", "bold")
    doc.text("President",leftMargin + 11, 172)
    doc.text("(Jamuna Foundation)", leftMargin, 177)


    // QR Code (left side)
    // try {
    //   const qrCodeUrl = await fetch(generateQRCodeDataURL(`Certificate ID: ${data.submissionId}`))
    //   if (qrCodeUrl.ok) {
    //     const qrBlob = await qrCodeUrl.arrayBuffer()
    //     const qrBase64 = `data:image/png;base64,${Buffer.from(qrBlob).toString("base64")}`
    //     doc.addImage(qrBase64, "PNG", 30, bottomY - 20, 25, 25)
    //   }
    // } catch (qrError) {
    //   console.warn("⚠️ Could not add QR code:", qrError)
    //   // Add placeholder QR code box
    //   doc.setDrawColor(0, 0, 0)
    //   doc.rect(30, bottomY - 20, 25, 25)
    //   doc.setFontSize(8)
    //   doc.text("QR", 42, bottomY - 7, { align: "center" })
    // }

    // QR Code (right side)
    try {
      const qrCodeUrl = await fetch(generateQRCodeDataURL(`Certificate ID: ${data.submissionId}`))
      if (qrCodeUrl.ok) {
        const qrBlob = await qrCodeUrl.arrayBuffer()
        const qrBase64 = `data:image/png;base64,${Buffer.from(qrBlob).toString("base64")}`
        doc.addImage(qrBase64, "PNG", pageWidth - 76, bottomY + 3, 25, 25)
      }
    } catch (qrError) {
      console.warn("⚠️ Could not add QR code:", qrError)
      // Add placeholder QR code box
      doc.setDrawColor(0, 0, 0)
      doc.rect(pageWidth - 50, bottomY - 20, 25, 25)
      doc.setFontSize(8)
      doc.text("QR", pageWidth - 32, bottomY - 7, { align: "center" })
    }

    // Footer text
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text("contact@jamunafoundation.com", 30, pageHeight - 15)
    doc.text("www.jamunafoundation.com", centerX, pageHeight - 15, { align: "center" })

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