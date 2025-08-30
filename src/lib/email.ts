import { transporter } from './nodemailer';

export async function sendInternshipApplicationEmail(
  id: string,
  firstName: string,
  email: string,
  domain: string,
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Jamuna Foundation Internship Submission</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @media screen and (max-width:600px) {
          .container { width:100% !important; }
          .stack-column { display:block !important; width:100% !important; text-align:center !important; }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f3f4f6; padding:20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="550" class="container" style="background-color:#ffffff; border:1px solid #e9e9e9; border-radius:4px;">

              <!-- ID Line -->
              <tr>
                <td align="right" style="font-size:13px; color:#4b5563; padding:18px 40px 0;">
                  Id: <strong>${id}</strong>
                </td>
              </tr>

              <!-- Logo -->
              <tr>
                <td align="center" style="padding:10px 40px;">
                  <img src="https://ims.jamunafoundation.com/images/logo.png" alt="Jamuna Foundation logo" style="max-width:100%; height:auto; display:block;" />
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 40px;">
                  <hr style="border:none; border-top:1px solid #d1d5db; margin:0;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 40px; font-size:15px; line-height:1.7; color:#111827;">
                  <p>Hi <strong>${firstName}</strong>,</p>
                  <p>You have successfully submitted your application for an internship in this domain: <strong>${domain}</strong></p>
                  <p>Someone will review your qualifications shortly. We will be in touch to schedule the next steps in the process.</p>
                  <p>Thank you for your interest in Jamuna Foundation.</p>
                  <p style="font-weight:bold; margin-top:16px;">Sincerely,<br/>Jamuna Foundation</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:32px 40px; border-top:1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <!-- Left: Social Links -->
                      <td align="left" valign="top" class="stack-column" style="font-size:14px; color:#374151; padding-bottom:20px;">
                        <div style="margin-bottom:10px; font-weight:500; text-align:center;">Visit our social accounts</div>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td style="padding-right:14px;">
                              <a href="https://www.facebook.com/jamunafoundationngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/facebook-logo.png" alt="Facebook" width="26" height="26" style="display:block;" />
                              </a>
                            </td>
                            <td style="padding-right:14px;">
                              <a href="https://www.linkedin.com/company/jamunafoundationngo/about/" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/linkedin-logo.png" alt="LinkedIn" width="26" height="26" style="display:block;" />
                              </a>
                            </td>
                            <td>
                              <a href="https://x.com/Jamuna_Ngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/x-logo.png" alt="X" width="26" height="26" style="display:block;" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>

                      <!-- Right: Website -->
                      <td align="right" valign="top" class="stack-column" style="font-size:14px; color:#374151;">
                        <div style="margin-bottom:10px; font-weight:500; text-align:center;">Check out our website</div>
                        <div style="text-align:center;">
                          <a href="https://www.jamunafoundation.com" target="_blank" style="font-size:14px; color:#111827; text-decoration:none; font-weight:500;">
                            www.jamunafoundation.com
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr> 
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Jamuna Foundation" <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `Your internship application for a position in ${domain} has been recieved at Jamuna Foundation!`,
    text: `Hi, ${firstName} we have received your internship application for a position in this domain: ${domain}. We will be in touch to schedule the next steps in the process. Thank you for your interest in Jamuna Foundation.`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Internship application email sent to:', email);
  } catch (error) {
    console.error('Error sending internship application email:', error);
    throw new Error('Failed to send internship application email.');
  }
}

export async function sendInternshipConfirmationEmail(
  id: string,
  candidateName: string,
  offerLetterUrl: string,
  startDate: string,
  endDate: string,
  taskLink: string,
  email: string,
  domain: string,
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Jamuna Foundation Internship Submission</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @media screen and (max-width:600px) {
          .container { width:100% !important; }
          .stack-column { display:block !important; width:100% !important; text-align:center !important; }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#222;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6; padding:20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" class="container" style="background:#ffffff; border:1px solid #e9e9e9; border-radius:4px;">

              <!-- ID -->
              <tr>
                <td align="right" style="font-size:13px; color:#4b5563; padding:18px 40px 0;">
                  Id: <strong>${id}</strong>
                </td>
              </tr>

              <!-- Logo -->
              <tr>
                <td align="center" style="padding:10px 40px;">
                  <img src="https://ims.jamunafoundation.com/images/logo.png" alt="Jamuna Foundation logo" style="display:block; max-width:100%; height:auto;" />
                </td>
              </tr>

              <!-- Divider -->
              <tr><td style="padding:0 40px;"><hr style="border:none; border-top:1px solid #d1d5db; margin:0;" /></td></tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 40px; font-size:15px; line-height:1.7; color:#222;">
                  <p>Congratulations <strong>${candidateName}</strong>, you are selected for the Jamuna Foundation Internship Program.</p>
                  <p>With great pleasure, we would like to offer you the Internship Position in <strong>${domain}</strong> at Jamuna Foundation.</p>
                  <p><strong>Offer Letter Link</strong> → 
                    <a href="${offerLetterUrl}" style="color:#1d4ed8;">${candidateName}</a>
                  </p>

                  <hr style="border:none; border-top:1px solid #d1d5db; margin:20px 0;" />

                  <p><strong>Some Very Important Points to Remember During This Internship:</strong></p>
                  <p style="margin:0 0 8px;">• Update your LinkedIn Profile and share all your achievements (Offer Letter / Internship Completion Certificate) that you received from us. Tag <strong>@jamunafoundationngo</strong> and use the hashtag <strong>#jamunafoundation</strong>.</p>
                  <p style="margin:0 0 8px;">• If your project or code is found copied, your internship will be terminated immediately, and you will be banned from further opportunities with us.</p>
                  <p style="margin:0 0 8px;">• Share a video of the completed task on LinkedIn, tag <strong>@jamunafoundationngo</strong>, and use the hashtag <strong>#jamunafoundation</strong>.</p>
                  <p style="margin:0 0 8px;">• For Tech Internship participants, maintain a separate GitHub repository named <strong>JAMUNA-FOUNDATION</strong> for all tasks. Share the link of this GitHub repository in the task submission form (which will be provided later via email).</p>

                  <p><strong>The timeline of the internship will be this way:</strong><br>
                  <strong>${startDate}</strong> - Internship Start Date<br>
                  <strong>${endDate}</strong> - Internship End Date</p>

                  <hr style="border:none; border-top:1px solid #d1d5db; margin:20px 0;" />

                  <p><strong>Tasks/Projects!</strong></p>
                  <p><strong>For ${domain}</strong> Tasks/projects PDF → 
                    <a href="${taskLink}" style="color:#1d4ed8;">click here</a>
                  </p>
                  <p>* Take reference, create your design<br>* No language barriers</p>
                  <p><strong>Task Submission link:</strong> 
                    <a href="https://www.jamunafoundation.com/internship-task-submission" style="color:#1d4ed8;">click here</a>
                  </p>

                  <hr style="border:none; border-top:1px solid #d1d5db; margin:20px 0;" />

                  <p>Congratulations once again on being selected.</p>
                  <p>Thanks for showing interest in <strong>Jamuna Foundation.</strong></p>
                  <p>Best Regards,<br><strong>Team Jamuna Foundation</strong></p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:32px 40px; border-top:1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <!-- Social -->
                      <td class="stack-column" align="center" valign="top" style="font-size:14px; padding-bottom:20px;">
                        <div style="margin-bottom:10px; font-weight:500;">Visit our social accounts</div>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td style="padding-right:14px;">
                              <a href="https://www.facebook.com/jamunafoundationngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/facebook-logo.png" width="26" height="26" style="display:block;" alt="Facebook" />
                              </a>
                            </td>
                            <td style="padding-right:14px;">
                              <a href="https://www.linkedin.com/company/jamunafoundationngo/about/" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/linkedin-logo.png" width="26" height="26" style="display:block;" alt="LinkedIn" />
                              </a>
                            </td>
                            <td>
                              <a href="https://x.com/Jamuna_Ngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/x-logo.png" width="26" height="26" style="display:block;" alt="X" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>

                      <!-- Website -->
                      <td class="stack-column" align="center" valign="top" style="font-size:14px;">
                        <div style="margin-bottom:10px; font-weight:500;">Visit our website</div>
                        <a href="https://www.jamunafoundation.com" target="_blank" style="color:#111827; text-decoration:none; font-weight:500;">
                          www.jamunafoundation.com
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Jamuna Foundation" <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `Congratulations! Here's your internship offer letter. You have been selected for an internship in ${domain}`,
    text: `Hi ${candidateName},\n\nYou have been selected for an internship in ${domain}.\n\nBest Regards,\nTeam Jamuna Foundation`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Internship confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending internship confirmation email:', error);
    throw new Error('Failed to send internship confirmation email.');
  }
}

export async function sendCertificateApplicationEmail(
  id: string,
  firstName: string,
  donation: string,
  email: string,
  domain: string,
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Jamuna Foundation Internship Task Submission</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @media screen and (max-width:600px) {
          .container { width:100% !important; }
          .stack-column { display:block !important; width:100% !important; text-align:center !important; }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f3f4f6; padding:20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="550" class="container" style="background-color:#ffffff; border:1px solid #e9e9e9; border-radius:4px;">

              <!-- ID Line -->
              <tr>
                <td align="right" style="font-size:13px; color:#4b5563; padding:18px 40px 0;">
                  Id: <strong>${id}</strong>
                </td>
              </tr>

              <!-- Logo -->
              <tr>
                <td align="center" style="padding:10px 40px;">
                  <img src="https://ims.jamunafoundation.com/images/logo.png" alt="Jamuna Foundation logo" style="max-width:100%; height:auto; display:block;" />
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 40px;">
                  <hr style="border:none; border-top:1px solid #d1d5db; margin:0;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 40px; font-size:15px; line-height:1.7; color:#111827;">
                  <p>Hi <strong>${firstName}</strong>,</p>
                  <p>Thank you for successfully submitting your internship task Submission application for the <strong>${domain}</strong> domain.</p>
                  <p>Our team will begin reviewing your submitted tasks shortly. Upon successful verification, your internship certificate will be released <strong>3 days</strong> after the official internship end date.</p>
                  <p>We truly appreciate your generous contribution of <strong>${donation}</strong> toward our cause - your support helps us create a bigger impact.</p>
                  <p>Thank you once again for your dedication and involvement with the Jamuna Foundation.</p>
                  <p style="font-weight:bold; margin-top:16px;">Warm regards,<br/>Jamuna Foundation</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:32px 40px; border-top:1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <!-- Left: Social Links -->
                      <td align="left" valign="top" class="stack-column" style="font-size:14px; color:#374151; padding-bottom:20px;">
                        <div style="margin-bottom:10px; font-weight:500; text-align:center;">Visit our social accounts</div>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td style="padding-right:14px;">
                              <a href="https://www.facebook.com/jamunafoundationngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/facebook-logo.png" alt="Facebook" width="26" height="26" style="display:block;" />
                              </a>
                            </td>
                            <td style="padding-right:14px;">
                              <a href="https://www.linkedin.com/company/jamunafoundationngo/about/" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/linkedin-logo.png" alt="LinkedIn" width="26" height="26" style="display:block;" />
                              </a>
                            </td>
                            <td>
                              <a href="https://x.com/Jamuna_Ngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/x-logo.png" alt="X" width="26" height="26" style="display:block;" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>

                      <!-- Right: Website -->
                      <td align="right" valign="top" class="stack-column" style="font-size:14px; color:#374151;">
                        <div style="margin-bottom:10px; font-weight:500; text-align:center;">Check out our website</div>
                        <div style="text-align:center;">
                          <a href="https://www.jamunafoundation.com" target="_blank" style="font-size:14px; color:#111827; text-decoration:none; font-weight:500;">
                            www.jamunafoundation.com
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr> 
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Jamuna Foundation" <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `Internship Task Submission Confirmation - Jamuna Foundation`,
    text: `Hi, ${firstName} we have received your internship task submission application for the ${domain} domain. Our team will begin reviewing your submitted tasks shortly.`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Internship task submission email sent to:', email);
  } catch (error) {
    console.error('Error sending internship task submission email:', error);
    throw new Error('Failed to send internship task submission email.');
  }
}

export async function sendCertificateConfirmationEmail(
  id: string,
  candidateName: string,
  certificateUrl: string,
  startDate: string,
  endDate: string,
  email: string,
  domain: string,
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Jamuna Foundation Internship Certificate</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @media screen and (max-width:600px) {
          .container { width:100% !important; }
          .stack-column { display:block !important; width:100% !important; text-align:center !important; }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#222;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6; padding:20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="650" cellspacing="0" cellpadding="0" border="0" class="container" style="background:#ffffff; border:1px solid #e9e9e9; border-radius:4px;">

              <!-- ID -->
              <tr>
                <td align="right" style="font-size:13px; color:#4b5563; padding:18px 40px 0;">
                  Id: <strong>${id}</strong>
                </td>
              </tr>

              <!-- Logo -->
              <tr>
                <td align="center" style="padding:10px 40px;">
                  <img src="https://ims.jamunafoundation.com/images/logo.png" alt="Jamuna Foundation logo" style="display:block; max-width:100%; height:auto;" />
                </td>
              </tr>

              <!-- Divider -->
              <tr><td style="padding:0 40px;"><hr style="border:none; border-top:1px solid #d1d5db; margin:0;" /></td></tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 40px; font-size:15px; line-height:1.7; color:#222;">
                  <p>Congratulations <strong>${candidateName}</strong>,</p>
                  <p>We are pleased to inform you that you have successfully completed your internship in the domain of <strong>${domain}</strong>, held from <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
                  <p>Throughout your internship, your <strong>dedication, discipline, and enthusiasm</strong> were awe-inspiring. The way you approached your assigned tasks, demonstrated problem-solving skills, and consistently delivered on expectations reflects your potential and commitment to growth.</p>
                  <p>Your contributions made a positive impact, and we hope this internship gave you valuable exposure to real-world applications, teamwork, and professional development.</p>
                  <p>We are pleased to share your official <strong>Internship Completion Certificate</strong> as a token of appreciation and recognition of your efforts. You are welcome to include this experience in your resume or LinkedIn profile as it reflects both learning and contribution in a professional setting.</p>
                  <p><strong>Internship Certificate Link</strong> → 
                    <a href="${certificateUrl}" style="color:#1d4ed8;">${candidateName}</a>
                  </p>

                  <hr style="border:none; border-top:1px solid #d1d5db; margin:20px 0;" />

                  <p><strong>What’s next?</strong></p>
                  <p>We encourage you to keep building on the knowledge and experience gained during this internship. Always stay curious, keep learning, and push your boundaries - the future holds great opportunities for individuals like you.</p>
                  <p>Should you require any verification in the future, feel free to reach out to us or scan the qr on the certificate. We’d be happy to help.</p>
                  <p>Once again, <strong>Congratulations</strong> on successfully completing your internship! We wish you the very best in all your future academic and career endeavours.</p>
                 
                  <hr style="border:none; border-top:1px solid #d1d5db; margin:20px 0;" />

                  <p>Thanks for showing interest in <strong>Jamuna Foundation.</strong></p>
                  <p>Warm Regards,<br><strong>Team Jamuna Foundation</strong></p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:32px 40px; border-top:1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <!-- Social -->
                      <td class="stack-column" align="center" valign="top" style="font-size:14px; padding-bottom:20px;">
                        <div style="margin-bottom:10px; font-weight:500;">Visit our social accounts</div>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td style="padding-right:14px;">
                              <a href="https://www.facebook.com/jamunafoundationngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/facebook-logo.png" width="26" height="26" style="display:block;" alt="Facebook" />
                              </a>
                            </td>
                            <td style="padding-right:14px;">
                              <a href="https://www.linkedin.com/company/jamunafoundationngo/about/" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/linkedin-logo.png" width="26" height="26" style="display:block;" alt="LinkedIn" />
                              </a>
                            </td>
                            <td>
                              <a href="https://x.com/Jamuna_Ngo" target="_blank">
                                <img src="https://ims.jamunafoundation.com/icons/x-logo.png" width="26" height="26" style="display:block;" alt="X" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>

                      <!-- Website -->
                      <td class="stack-column" align="center" valign="top" style="font-size:14px;">
                        <div style="margin-bottom:10px; font-weight:500;">Visit our website</div>
                        <a href="https://www.jamunafoundation.com" target="_blank" style="color:#111827; text-decoration:none; font-weight:500;">
                          www.jamunafoundation.com
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Jamuna Foundation" <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: `Certificate of Internship Completion – Congratulations, ${candidateName}!`,
    text: `Hi ${candidateName},\n\nwe are thrilled to inform you that your internship has been completed successfully. Please find attached the certificate of internship completion.\n\nWarm Regards,\nTeam Jamuna Foundation`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Internship certificate email sent to:', email);
  } catch (error) {
    console.error('Error sending internship certificate email:', error);
    throw new Error('Failed to send internship certificate email.');
  }
}