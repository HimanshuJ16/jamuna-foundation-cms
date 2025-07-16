import jsPDF from "jspdf"

interface OfferLetterData {
  candidateName: string
  domain: string
  startDate: string
  endDate: string
  submissionId: string
}

// Function to load image from public folder (for server-side)
async function loadImageFromPublic(imagePath: string): Promise<string> {
  try {
    // For server-side, we'll use a placeholder or fetch from the public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${imagePath}`

    const response = await fetch(publicUrl)
    if (!response.ok) {
      console.warn(`Could not load image from ${publicUrl}`)
      return ""
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    // Determine mime type from file extension
    let mimeType = "image/png"
    if (imagePath.includes(".jpg") || imagePath.includes(".jpeg")) {
      mimeType = "image/jpeg"
    } else if (imagePath.includes(".gif")) {
      mimeType = "image/gif"
    }

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.warn(`Warning: Could not load image ${imagePath}:`, error)
    return ""
  }
}

export async function generateOfferLetterPDF(data: OfferLetterData): Promise<Buffer> {
  try {
    console.log("📄 Starting PDF generation with data:", data)

    const doc = new jsPDF()

    // Set margins
    const leftMargin = 13
    const rightMargin = 13
    const pageWidth = doc.internal.pageSize.width
    const centerX = pageWidth / 2

    // Load images from public folder
    console.log("🖼️ Loading images from public folder...")

    const logoBase64 = await loadImageFromPublic("/images/logo.png")
    const signatureBase64 = await loadImageFromPublic("/images/signature.jpg")
    const watermarkBase64 = await loadImageFromPublic("/images/watermark.jpg")
    const stampBase64 = await loadImageFromPublic("/images/stamp-gemini.png")

    // Add logo at the top (if available)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", centerX - 50, 5, 105, 35) // Centered logo, 105x35 size (ratio 3:1)
        console.log("✅ Logo added successfully")
      } catch (logoError) {
        console.warn("⚠️ Could not add logo:", logoError)
      }
    }

    // Add watermark (if available)
    if (watermarkBase64) {
      try {
        const pageWidth = doc.internal.pageSize.width
        const pageHeight = doc.internal.pageSize.height
      
        const watermarkWidth = 120
        const watermarkHeight = 120
      
        const watermarkX = (pageWidth - watermarkWidth) / 2
        const watermarkY = (pageHeight - watermarkHeight) / 2
      
        doc.setGState(new (doc.GState as any)({ opacity: 0.08 }))
        doc.addImage(watermarkBase64, "JPEG", watermarkX, watermarkY, watermarkWidth, watermarkHeight)
        doc.setGState(new (doc.GState as any)({ opacity: 1 })) // Reset to default opacity
        console.log("✅ Watermark added successfully")
      } catch (watermarkError) {
        console.warn("⚠️ Could not add watermark:", watermarkError)
      }
    }

    // Title - INTERNSHIP OFFER LETTER (centered, bold, large)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("INTERNSHIP OFFER LETTER", centerX, 55, { align: "center" })

    // Divider line after title
    doc.setDrawColor(0) // black color
    doc.setLineWidth(0.2)
    doc.line(leftMargin, 60, pageWidth - rightMargin, 60) // from left to right

    // Date and ID on same line
    doc.setFontSize(12)

    const today = new Date()
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + 1)
    const nextDateFormatted = nextDay.toLocaleDateString("en-GB")

    // Date label (normal)
    doc.setFont("helvetica", "normal")
    doc.text("Date:", leftMargin, 70)

    // Date value (bold)
    doc.setFont("helvetica", "bold")
    doc.text(nextDateFormatted, leftMargin + 11, 70) // adjust spacing as needed

    // ID label (normal)
    doc.setFont("helvetica", "normal")
    doc.text("Id:", pageWidth - rightMargin - 87, 70)

    // ID value (bold)
    doc.setFont("helvetica", "bold")
    doc.text(data.submissionId, pageWidth - rightMargin - 82, 70) // adjust spacing as needed


    // Dear section
    doc.setFont("helvetica", "normal")
    doc.text("Dear,", leftMargin, 90)
    doc.setFont("helvetica", "bold")
    doc.text(`            ${data.candidateName}`, leftMargin, 97)

    // Main body paragraph 1
    const paragraphParts = [
      { text: 'We would like to congratulate you on being selected for the "', style: 'normal' },
      { text: data.domain, style: 'bold' },
      { text: `" virtual internship position with "`, style: 'normal' },
      { text: 'Jamuna Foundation', style: 'bold' },
      { text: `". We at `, style: 'normal' },
      { text: 'Jamuna Foundation', style: 'bold' },
      { text: ' are excited that you will join our team.', style: 'normal' },
    ]

    let x = leftMargin
    let y = 110
    const lineHeight = 7
    const maxWidth = pageWidth - rightMargin

    for (const part of paragraphParts) {
      const words = part.text.split(" ")
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "")
        doc.setFont("helvetica", part.style)
        const wordWidth = doc.getTextWidth(word)
      
        if (x + wordWidth > maxWidth) {
          y += lineHeight
          x = leftMargin
        }
      
        doc.text(word, x, y)
        x += wordWidth
      }
    }
    
    // Main body paragraph 2
    const para2Parts = [
      { text: 'The duration of the internship will be of ', style: 'normal' },
      { text: '4 weeks, ', style: 'bold' },
      { text: 'starting from ', style: 'normal' },
      { text: data.startDate, style: 'bold' },
      { text: ' to ', style: 'normal' },
      { text: data.endDate, style: 'bold' },
      { text: '. The internship is an educational opportunity for you hence the primary focus is on learning and developing new skills and gaining hands-on knowledge. We believe that you will perform all your tasks/projects.', style: 'normal' },
    ]

    x = leftMargin
    y = 135

    for (const part of para2Parts) {
      const words = part.text.split(" ")
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "")
        doc.setFont("helvetica", part.style)
        const wordWidth = doc.getTextWidth(word)
      
        if (x + wordWidth > pageWidth - rightMargin) {
          y += lineHeight
          x = leftMargin
        }
      
        doc.text(word, x, y)
        x += wordWidth
      }
    }


    // Main body paragraph 3
    const bodyText3 = "As an intern, we expect you to perform all assigned tasks to the best of your ability and follow any lawful and reasonable instructions provided to you."

    x = leftMargin
    y = 167
    doc.setFont("helvetica", "normal")

    const words3 = bodyText3.split(" ")
    for (let i = 0; i < words3.length; i++) {
      const word = words3[i] + (i < words3.length - 1 ? " " : "")
      const wordWidth = doc.getTextWidth(word)
    
      if (x + wordWidth > pageWidth - rightMargin) {
        y += lineHeight
        x = leftMargin
      }
    
      doc.text(word, x, y)
      x += wordWidth
    }
    
    // Main body paragraph 4
    const bodyText4 = "We are confident that this internship will be a valuable experience for you, we look forward to working with you and helping you achieve your career goals."

    x = leftMargin
    y = 186
    doc.setFont("helvetica", "normal")

    const words4 = bodyText4.split(" ")
    for (let i = 0; i < words4.length; i++) {
      const word = words4[i] + (i < words4.length - 1 ? " " : "")
      const wordWidth = doc.getTextWidth(word)
    
      if (x + wordWidth > pageWidth - rightMargin) {
        y += lineHeight
        x = leftMargin
      }
    
      doc.text(word, x, y)
      x += wordWidth
    }

    // Main body paragraph 5
    const bodyText5 = "By accepting this offer, you commit to executing assigned tasks diligently and ensuring excellence in all aspects of your work."

    x = leftMargin
    y = 205
    doc.setFont("helvetica", "normal")

    const words5 = bodyText5.split(" ")
    for (let i = 0; i < words5.length; i++) {
      const word = words5[i] + (i < words5.length - 1 ? " " : "")
      const wordWidth = doc.getTextWidth(word)
    
      if (x + wordWidth > pageWidth - rightMargin) {
        y += lineHeight
        x = leftMargin
      }
    
      doc.text(word, x, y)
      x += wordWidth
    }

    // Closing
    doc.text("Best of Luck!", leftMargin, 225)
    doc.setFont("helvetica", "bold")
    doc.text("Thank You!", leftMargin, 240)

    // Add signature (if available)
    if (signatureBase64) {
      try {
        doc.addImage(signatureBase64, "PNG", leftMargin, 255, 40, 16) // Signature above "Founder"
        console.log("✅ Signature added successfully")
      } catch (signatureError) {
        console.warn("⚠️ Could not add signature:", signatureError)
      }
    }

    if (stampBase64) {
      try {
        doc.addImage(stampBase64, "PNG", 133, 250, 35, 35)
        console.log("✅ stamp added successfully")
      } catch (stampError) {
        console.warn("⚠️ Could not add stamp:", stampError)
      }
    }

    // Footer section
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("President", leftMargin + 11, 280)
    doc.text("(Jamuna Foundation)", leftMargin, 285)

    // Generate PDF buffer
    const pdfArrayBuffer = doc.output("arraybuffer")
    const pdfBuffer = Buffer.from(pdfArrayBuffer)

    console.log("✅ PDF generated successfully")
    console.log("📊 PDF size:", pdfBuffer.length, "bytes")

    return pdfBuffer
  } catch (error) {
    console.error("❌ Error generating PDF:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
