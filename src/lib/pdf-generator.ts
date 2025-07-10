import jsPDF from "jspdf"

interface OfferLetterData {
  candidateName: string
  domain: string
  startDate: string
  endDate: string
  submissionId: string
}

export async function generateOfferLetterPDF(data: OfferLetterData): Promise<Buffer> {
  try {
    console.log("📄 Starting PDF generation with data:", data)

    const doc = new jsPDF()

    // Set margins
    const leftMargin = 20
    const rightMargin = 20
    const pageWidth = doc.internal.pageSize.width
    const centerX = pageWidth / 2

    // Title - INTERNSHIP OFFER LETTER (centered, bold, large)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("INTERNSHIP OFFER LETTER", centerX, 40, { align: "center" })

    // Date and ID on same line
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    const currentDate = new Date().toLocaleDateString("en-GB") // DD/MM/YYYY format
    doc.text(`Date : ${currentDate}`, leftMargin, 60)
    doc.text(`ID:${data.submissionId}`, pageWidth - rightMargin - 40, 60)

    // Dear section
    doc.text("Dear,", leftMargin, 80)
    doc.setFont("helvetica", "bold")
    doc.text(`            ${data.candidateName}`, leftMargin, 95)

    // Main body paragraph 1
    doc.setFont("helvetica", "normal")
    const bodyText1 = `We would like to congratulate you on being selected for the "${data.domain}" virtual internship position with "CodSoft". We at CodSoft are excited that you will join our team.`

    // Split long text into multiple lines
    const splitText1 = doc.splitTextToSize(bodyText1, pageWidth - leftMargin - rightMargin)
    doc.text(splitText1, leftMargin, 110)

    // Main body paragraph 2
    const bodyText2 = `The duration of the internship will be of 4 weeks, starting from ${data.startDate} to ${data.endDate}. The internship is an educational opportunity for you hence the primary focus is on learning and developing new skills and gaining hands-on knowledge. We believe that you will perform all your tasks/projects.`

    const splitText2 = doc.splitTextToSize(bodyText2, pageWidth - leftMargin - rightMargin)
    doc.text(splitText2, leftMargin, 135)

    // Main body paragraph 3
    const bodyText3 =
      "As an intern, we expect you to perform all assigned tasks to the best of your ability and follow any lawful and reasonable instructions provided to you."

    const splitText3 = doc.splitTextToSize(bodyText3, pageWidth - leftMargin - rightMargin)
    doc.text(splitText3, leftMargin, 165)

    // Main body paragraph 4
    const bodyText4 =
      "We are confident that this internship will be a valuable experience for you, we look forward to working with you and helping you achieve your career goals."

    const splitText4 = doc.splitTextToSize(bodyText4, pageWidth - leftMargin - rightMargin)
    doc.text(splitText4, leftMargin, 185)

    // Main body paragraph 5
    const bodyText5 =
      "By accepting this offer, you commit to executing assigned tasks diligently and ensuring excellence in all aspects of your work."

    const splitText5 = doc.splitTextToSize(bodyText5, pageWidth - leftMargin - rightMargin)
    doc.text(splitText5, leftMargin, 205)

    // Closing
    doc.text("Best of Luck!", leftMargin, 230)
    doc.text("Thank You!", leftMargin, 245)

    // Footer section
    doc.setFontSize(11)
    doc.text("Founder (CodSoft)", leftMargin, 270)
    doc.text("MSME Registered", pageWidth - rightMargin - 40, 270)

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
