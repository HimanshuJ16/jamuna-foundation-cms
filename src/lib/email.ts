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
    /* Add your existing page, container, and body styles here... */
    html, body { margin: 0; padding: 0; background: #f3f4f6; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width: 550px; margin: 24px auto 48px; background: #ffffff; border: 1px solid #e9e9e9; box-shadow: 0 0 5px rgba(0,0,0,0.04); border-radius: 4px; overflow: hidden; }
    /* --- Styles for other sections of the email --- */
    .id-line { font-size: 13px; color: #4b5563; text-align: right; padding: 18px 40px 0; }
    .letterhead { padding: 10px 40px; }
    .logo img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
    .divider { border: none; border-top: 1px solid #d1d5db; margin: 8px 0 0; }
    .body { padding: 28px 40px; font-size: 15px; line-height: 1.7; }
    .signature { margin-top: 16px; font-weight: bold; }


    /* --- NEW FOOTER STYLES --- */
    .site-footer {
      padding: 24px 40px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      text-align: center;
      color: #374151;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      align-items: center;
      gap: 20px;
    }

    .footer-section .label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 10px;
      display: block;
    }

    .icon-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      list-style: none; /* Removes bullet points from ul */
      padding: 0;
      margin: 0;
    }
    
    .icon-link {
      display: inline-block;
      text-decoration: none;
      color: #111827;
      font-weight: 600;
      transition: transform 0.2s ease-out;
    }

    .icon-link:hover {
      transform: translateY(-2px); /* Subtle lift effect */
    }

    .icon-link img {
      filter: brightness(0);    
      width: 24px;
      height: 24px;
      vertical-align: middle; /* Aligns icon with text */
      margin-right: 6px; /* Space between icon and text */
    }
    
    /* Responsive styles for the grid */
    @media (max-width: 500px) {
      .footer-grid {
        grid-template-columns: 1fr; /* Stack columns on small screens */
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="id-line">Id: <strong>${id}</strong></div>
    <div class="letterhead"><div class="logo"><img src="https://ims.jamunafoundation.com/images/logo.png" alt="Jamuna Foundation logo" /></div></div>
    <hr class="divider" />
    <div class="body">
      <p>Hi <strong>${firstName}</strong>,</p>
      <p>You have successfully submitted your application for an internship in this domain: <strong>${domain}</strong></p>
      <p>Someone will review your qualifications shortly...</p>
      <div class="signature">Sincerely,<br />Jamuna Foundation</div>
    </div>
    
    <footer class="site-footer" role="contentinfo">
      <div class="footer-grid">
        <div class="footer-section">
          <span class="label">Connect with us</span>
          <ul class="icon-links">
            <li>
              <a href="https://www.facebook.com/jamunafoundationngo" class="icon-link" target="_blank" rel="noopener noreferrer" title="Facebook">
                <img src="https://images.wixstatic.com/media/5e9922_549fe65f377b4459894488d785954edd~mv2.png" alt="Facebook icon" />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/jamunafoundationngo/about/" class="icon-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <img src="https://images.wixstatic.com/media/5e9922_931f3e857768439bb9293a3039d6f9ef~mv2.png" alt="LinkedIn icon" />
              </a>
            </li>
            <li>
              <a href="https://x.com/Jamuna_Ngo" class="icon-link" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                <img src="https://images.wixstatic.com/media/5e9922_64d32055fbe647738b345b72f05aef96~mv2.png" alt="X icon" />
              </a>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <span class="label">Official website</span>
          <a href="https://www.jamunafoundation.com" class="icon-link" target="_blank" rel="noopener noreferrer">
            <img src="https://images.wixstatic.com/media/b49ee3_dd9b1a8812ae41138409a667954a6088~mv2.png" alt="Website icon" />
          </a>
        </div>
      </div>
    </footer>

  </div>
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
        /* Page */
        html, body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
          color: #222;
        }

        /* Card container */
        .container {
          max-width: 550px;
          margin: 24px auto 48px;
          background: #ffffff;
          border: 1px solid #e9e9e9;
          box-shadow: 0 0 5px rgba(0,0,0,0.04);
          border-radius: 4px;
          overflow: hidden;
        }

        /* Top ID line */
        .id-line {
          font-size: 13px;
          color: #4b5563;
          text-align: right;
          padding: 18px 40px 0px 40px;
        }
        .id-line strong {
          font-weight: 600;
        }

        /* Letterhead */
        .letterhead {
          padding: 10px 40px;
        }
        .logo img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 0 auto;
        }

        /* Divider */
        .divider {
          border: none;
          border-top: 1px solid #d1d5db;
          margin: 8px 0 0;
        }

        /* Body */
        .body {
          padding: 28px 40px;
          font-size: 15px;
          line-height: 1.7;
          color: #222;
        }
        .body p {
          margin: 0 0 14px;
        }

        /* Signature */
        .signature {
          margin-top: 16px;
        }
        .signature strong {
          font-weight: 700;
        }

        /* Footer */
        .footer-divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 18px 0 0;
        }
        .footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
          padding: 20px 40px 24px;
          color: #222;
          gap: 0;
        }
        .footer .col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          padding: 8px 12px;
        }
        .footer .col + .col {
          border-left: 2px solid #e5e7eb;
        }
        .footer .label {
          color: #6b7280;
          font-size: 13px;
        }
        .icons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }
        .icons img {
          width: 26px;
          height: 26px;
          display: inline-block;
          opacity: 0.95;
        }

        /* Responsive */
        @media (max-width: 450px) {
          .logo img {
            width: 100%;
            height: auto;
            max-width: 380px;
          }
          .footer {
            grid-template-columns: 1fr;
            padding: 16px 24px 20px;
          }
          .footer .col + .col {
            border-left: 0;
            border-top: 2px solid #e5e7eb;
            margin-top: 12px;
            padding-top: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="id-line">
          Id: <strong>${id}</strong>
        </div>

        <div class="letterhead">
          <div class="logo">
            <img src="https://ims.jamunafoundation.com/images/logo.png" alt="Jamuna Foundation logo" />
          </div>
        </div>

        <hr class="divider" />

        <div class="body">
          <p>Congratulations <strong>${candidateName}</strong>, you are selected for the Jamuna Foundation Internship Program.</p>
          <p>With great pleasure, we would like to offer you the Internship Position in <strong>${domain}</strong> at Jamuna Foundation.</p>
          <p><strong>Offer Letter Link</strong> -> 
            <a href="${offerLetterUrl}">${candidateName}</a>
          </p>
          
          <hr class="divider" />
          
          <p> </p>
          <p><strong>Some Very Important Points to Remember During This Internship</strong></p>
          <ul>
              <li>Update your LinkedIn Profile and share all your achievements (Offer Letter / Internship Completion Certificate) that you received from us. Tag <strong>@jamunafoundationngo</strong> and use the hashtag <strong>#jamunafoundation</strong>.</li>
              <li>If your project or code is found copied, your internship will be terminated immediately, and you will be banned from further opportunities with us.</li>
              <li>Share a video of the completed task on LinkedIn, tag <strong>@jamunafoundationngo</strong>, and use the hashtag <strong>#jamunafoundation</strong>.</li>
              <li>For Tech Internship participants, maintain a separate GitHub repository named <strong>JAMUNA-FOUNDATION</strong> for all tasks. Share the link of this GitHub repository in the task submission form (which will be provided later via email).</li>
          </ul>
          <div class="timeline">
              <p><strong>The timeline of the internship will be this way.</strong></p>
              <p><strong>${startDate}</strong> - Internship Start Date<br><strong>${endDate}</strong> - Internship End Date</p>
          </div>

          <hr class="divider" />
          
          <p> </p>
          <p><strong>Tasks/Projects!</strong></p>
          <p><strong>For ${domain} </strong>Tasks/projects, PDF -> 
            <a href="${taskLink}">click here</a>
          </p>
          <p>*take a reference, create your design<br>*no language barriers</p>
          <p><strong>Task Submission link: </strong>
            <a href="https://www.jamunafoundation.com/internship-task-submission">click here</a>
          </p>

          <hr class="divider" />
          
          <p> </p>
          <p>Congratulations, once again, on being selected.</p>
          <p>Thanks for showing interest in <strong>Jamuna Foundation.</strong></p>
          <p>Best Regards,<br><strong>Team Jamuna Foundation</strong></p>
        </div>

        <hr class="divider" />

        <div class="footer" role="contentinfo" aria-label="Footer">
          <div class="col" aria-label="Social links">
            <div class="label">Visit our social accounts</div>
            <div class="icons">
              <a href="https://www.facebook.com/jamunafoundationngo">
                <img src="https://images.wixstatic.com/media/5e9922_549fe65f377b4459894488d785954edd~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/5e9922_549fe65f377b4459894488d785954edd~mv2.png" alt="Facebook" />
              </a>
              <a href="https://www.linkedin.com/company/jamunafoundationngo/about/">
                <img src="https://images.wixstatic.com/media/5e9922_931f3e857768439bb9293a3039d6f9ef~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/5e9922_931f3e857768439bb9293a3039d6f9ef~mv2.png" alt="LinkedIn" />
              </a>
              <a href="https://x.com/Jamuna_Ngo">
                <img src="https://images.wixstatic.com/media/5e9922_64d32055fbe647738b345b72f05aef96~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/5e9922_64d32055fbe647738b345b72f05aef96~mv2.png" alt="X (Twitter)" />
              </a> 
            </div>
          </div>

          <div class="col" aria-label="Website link">
            <div class="label">Visit our website</div>
            <a href="https://www.jamunafoundation.com">
              <div class="icons" aria-hidden="true">
                <img src="https://images.wixstatic.com/media/b49ee3_dd9b1a8812ae41138409a667954a6088~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/b49ee3_dd9b1a8812ae41138409a667954a6088~mv2.png" alt="Arrow icon" />
              </div>
            </a>
          </div>
        </div>
      </div>
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