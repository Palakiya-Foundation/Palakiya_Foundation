import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';

const contactNotificationEmail = ({ name, email, phone, subject, message }) => {
  const safeSubject = subject?.trim() || 'New contact message';

  const text = `You have received a new message from the website contact form.\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || '-'}\n` +
    `Subject: ${safeSubject}\n\n` +
    `Message:\n${message}\n`;

  return {
    subject: `[Contact] ${safeSubject}`,
    text,
  };
};

// POST /api/contacts  (public)
export const createContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, phone, subject, message } = req.body;
  const contact = await prisma.contact.create({
    data: { name, email, phone, subject, message },
  });

  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER;
  const { subject: emailSubject, text } = contactNotificationEmail({
    name,
    email,
    phone,
    subject,
    message,
  });

  // If email fails, still succeed contact submission (DB record is already saved)
  let emailSent = false;
  let emailError;

  const result = await sendEmail({
    to: receiver,
    subject: emailSubject,
    text,
  });

  emailSent = result.sent;
  emailError = result.error;

  res.status(201).json({
    message: 'Thank you for reaching out! We will get back to you soon.',
    id: contact.id,
    emailSent,
    emailError,
  });
});

// GET /api/contacts  (admin)
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(contacts);
});

// PATCH /api/contacts/:id/read  (admin)
export const markRead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const contact = await prisma.contact.update({
    where: { id },
    data: { read: true },
  });
  res.json(contact);
});

// DELETE /api/contacts/:id  (admin)
export const deleteContact = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.contact.delete({ where: { id } });
  res.json({ message: 'Contact deleted' });
});
