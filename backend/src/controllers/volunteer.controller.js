import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { Parser } from '@json2csv/plainjs';

const orgName = () => process.env.ORG_NAME || 'Palakiya Foundation';

const orgMission = () =>
  process.env.ORG_MISSION ||
  'improving lives through education, healthcare and community development';

const orgAddress = () =>
  process.env.ORG_ADDRESS ||
  '7A third floor , Radhey Shyam Park , Delhi 110051';

const orgSupportEmail = () =>
  process.env.ORG_SUPPORT_EMAIL ||
  'admin@palakiyafoundation.org';

const orgWebsite = () =>
  process.env.ORG_WEBSITE ||
  'https://palakiyafoundation.org';

/**
 * Professional Email Layout
 * Designed to look like a genuine organizational email
 * instead of a promotional newsletter.
 */
const emailWrapper = (bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>
<title>${orgName()}</title>
</head>

<body
style="
margin:0;
padding:0;
background:#f5f6fa;
font-family:Arial,Helvetica,sans-serif;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
role="presentation"
style="padding:40px 0;background:#f5f6fa;"
>

<tr>
<td align="center">

<table
width="620"
cellpadding="0"
cellspacing="0"
role="presentation"
style="
background:#ffffff;
border-radius:10px;
overflow:hidden;
border:1px solid #e7e7e7;
"
>

<tr>
<td
style="
background:#146c43;
padding:22px 35px;
"
>

<div
style="
font-size:22px;
font-weight:bold;
color:white;
"
>
${orgName()}
</div>

</td>
</tr>

<tr>
<td
style="
padding:35px;
font-size:15px;
color:#333;
line-height:1.8;
"
>

${bodyHtml}

</td>
</tr>

<tr>
<td
style="
padding:0 35px;
"
>

<hr
style="
border:none;
border-top:1px solid #ececec;
"
/>

</td>
</tr>

<tr>

<td
style="
padding:25px 35px;
font-size:14px;
line-height:1.8;
color:#555;
"
>

<strong>${orgName()}</strong>

<br><br>

Website:
<a
href="${orgWebsite()}"
style="
color:#146c43;
text-decoration:none;
"
>
${orgWebsite()}
</a>

<br><br>

Email:
<a
href="mailto:${orgSupportEmail()}"
style="
color:#146c43;
text-decoration:none;
"
>
${orgSupportEmail()}
</a>

<br><br>

Address:
${orgAddress()}

<br><br>

Thank you for your interest in supporting our work.

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;

const approvalEmail = (name) => ({
  subject: 'Volunteer Application Approved',

  text: `Hello ${name},

Thank you for applying to volunteer with ${orgName()}.

We are pleased to inform you that your application has been approved.

Our volunteer coordination team will contact you shortly with the next steps, onboarding details and upcoming activities.

We appreciate your willingness to contribute to our initiatives and look forward to working with you.

Regards,

Volunteer Coordination Team
${orgName()}

Website:
${orgWebsite()}

Email:
${orgSupportEmail()}
`,

  html: emailWrapper(`

<h2
style="
margin-top:0;
color:#146c43;
"
>
Volunteer Application Approved
</h2>

<p>
Hello <strong>${name}</strong>,
</p>

<p>

Thank you for applying to volunteer with
<strong>${orgName()}</strong>.

</p>

<p>

We are pleased to let you know that your application has been approved.

</p>

<p>

Our Volunteer Coordination Team will contact you shortly with onboarding information and details regarding upcoming volunteer opportunities.

</p>

<p>

We appreciate your willingness to support our initiatives and look forward to working with you.

</p>

<br>

<p>

Regards,

<br><br>

<strong>Volunteer Coordination Team</strong>

<br>

${orgName()}

</p>

`),
});



const rejectionEmail = (name) => ({
  subject: 'Volunteer Application Update',

  text: `Hello ${name},

Thank you for your interest in volunteering with ${orgName()}.

After reviewing your application, we regret to inform you that we are unable to proceed with your application at this time.

This decision does not reflect your abilities or commitment. We encourage you to apply again in the future as new opportunities become available.

Thank you once again for your interest in supporting our work.

Regards,

Volunteer Coordination Team
${orgName()}

Website:
${orgWebsite()}

Email:
${orgSupportEmail()}
`,

  html: emailWrapper(`

<h2
style="
margin-top:0;
color:#333333;
"
>
Volunteer Application Update
</h2>

<p>

Hello
<strong>${name}</strong>,

</p>

<p>

Thank you for your interest in volunteering with
<strong>${orgName()}</strong>.

</p>

<p>

After reviewing your application, we regret to inform you that we are unable to proceed with your application at this time.

</p>

<p>

We sincerely appreciate your interest in supporting our work and encourage you to apply again in the future as new volunteer opportunities become available.

</p>

<br>

<p>

Regards,

<br><br>

<strong>Volunteer Coordination Team</strong>

<br>

${orgName()}

</p>

`),
});
// =======================================================
// POST /api/volunteers/apply (Public)
// =======================================================

export const applyVolunteer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }

  const {
    name,
    email,
    phone,
    message,
    interest,
  } = req.body;

  const volunteer = await prisma.volunteer.create({
    data: {
      name,
      email,
      phone,
      message,
      interest: interest || null,
    },
  });

  res.status(201).json({
    success: true,
    id: volunteer.id,
    message:
      'Thank you. Your volunteer application has been submitted successfully.',
  });
});



// =======================================================
// GET /api/volunteers (Admin)
// =======================================================

export const getVolunteers = asyncHandler(async (req, res) => {

  const { status } = req.query;

  const where = {};

  if (status && status !== 'all') {
    where.status = status;
  }

  const volunteers = await prisma.volunteer.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(volunteers);

});

// =======================================================
// GET /api/volunteers/export
// =======================================================

export const exportVolunteers = asyncHandler(async (req, res) => {

  const volunteers = await prisma.volunteer.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const rows = volunteers.map((v) => ({
    ID: v.id,
    Name: v.name,
    Email: v.email,
    Phone: v.phone,
    Interest: v.interest || '',
    Message: v.message,
    Status: v.status,
    AppliedAt: v.createdAt,
  }));

  const parser = new Parser();

  const csv = parser.parse(rows);

  res.header('Content-Type', 'text/csv');

  res.attachment('volunteers.csv');

  return res.send(csv);

});

// =======================================================
// Shared Status Update
// =======================================================

const updateStatus = async (
  id,
  status,
  buildEmail,
  attachments = []
) => {

  const existing = await prisma.volunteer.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    return {
      notFound: true,
    };
  }

  const volunteer = await prisma.volunteer.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  const {
    subject,
    text,
    html,
  } = buildEmail(volunteer.name);

  const result = await sendEmail({

    to: volunteer.email,

    subject,

    text,

    html,

    attachments,

    replyTo: orgSupportEmail(),

    headers: {

      /**
       * Helps Gmail understand
       * this mail belongs to your domain.
       */

      "X-Entity-Ref-ID": `${volunteer.id}-${Date.now()}`,

      /**
       * Less promotional than List-ID.
       */

      "Auto-Submitted": "auto-generated",

      /**
       * Reduces spam complaints.
       */

      "List-Unsubscribe":
        `<mailto:${orgSupportEmail()}?subject=unsubscribe>`,

      "List-Unsubscribe-Post":
        "List-Unsubscribe=One-Click",

      /**
       * Better threading.
       */

      "X-Mailer": orgName(),

    },

  });

  return {

    volunteer,

    emailSent: result.sent,

    emailError: result.error,

  };

};
// =======================================================
// PUT /api/volunteers/:id/approve (Admin)
// =======================================================

export const approveVolunteer = asyncHandler(async (req, res) => {

  const id = Number(req.params.id);

  const result = await updateStatus(
    id,
    'approved',
    approvalEmail
  );

  if (result.notFound) {
    return res.status(404).json({
      message: 'Volunteer not found',
    });
  }

  res.json({
    success: true,
    volunteer: result.volunteer,
    emailSent: result.emailSent,
    message: result.emailSent
      ? 'Volunteer approved and notification email sent successfully.'
      : 'Volunteer approved, but the email could not be delivered.',
  });

});



// =======================================================
// PUT /api/volunteers/:id/reject (Admin)
// =======================================================

export const rejectVolunteer = asyncHandler(async (req, res) => {

  const id = Number(req.params.id);

  const result = await updateStatus(
    id,
    'rejected',
    rejectionEmail
  );

  if (result.notFound) {
    return res.status(404).json({
      message: 'Volunteer not found',
    });
  }

  res.json({
    success: true,
    volunteer: result.volunteer,
    emailSent: result.emailSent,
    message: result.emailSent
      ? 'Volunteer rejected and notification email sent successfully.'
      : 'Volunteer rejected, but the email could not be delivered.',
  });

});



// =======================================================
// DELETE /api/volunteers/:id
// =======================================================

export const deleteVolunteer = asyncHandler(async (req, res) => {

  const id = Number(req.params.id);

  await prisma.volunteer.delete({
    where: {
      id,
    },
  });

  res.json({
    success: true,
    message: 'Volunteer deleted successfully.',
  });

});