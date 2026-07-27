import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ---- Design tokens -------------------------------------------------------
const PAGE_WIDTH = 842; // A4 landscape
const PAGE_HEIGHT = 595;

const COLORS = {
  primary: rgb(0.05, 0.32, 0.18), // deep green
  accent: rgb(0.78, 0.62, 0.13), // gold
  text: rgb(0.15, 0.15, 0.15),
  subtext: rgb(0.35, 0.35, 0.35),
  border: rgb(0.78, 0.62, 0.13),
  nameColor: rgb(0.08, 0.24, 0.55),
};

/**
 * Draws text centered horizontally on the page.
 */
const drawCentered = (page, text, { y, size, font, color }) => {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (PAGE_WIDTH - width) / 2,
    y,
    size,
    font,
    color,
  });
};

export const generateCertificate = async (volunteerName) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const orgName = process.env.ORG_NAME || "Palakiya Foundation";

  // ---- Outer & inner decorative borders ----------------------------------
  const margin = 24;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: PAGE_WIDTH - margin * 2,
    height: PAGE_HEIGHT - margin * 2,
    borderColor: COLORS.border,
    borderWidth: 3,
  });

  const innerMargin = 34;
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: PAGE_WIDTH - innerMargin * 2,
    height: PAGE_HEIGHT - innerMargin * 2,
    borderColor: COLORS.primary,
    borderWidth: 1,
  });

  // ---- Header -------------------------------------------------------------
  drawCentered(page, orgName.toUpperCase(), {
    y: 505,
    size: 14,
    font: bodyFont,
    color: COLORS.subtext,
  });

  drawCentered(page, "CERTIFICATE OF VOLUNTEERING", {
    y: 465,
    size: 32,
    font: titleFont,
    color: COLORS.primary,
  });

  // Decorative rule under the title
  const ruleWidth = 220;
  page.drawLine({
    start: { x: (PAGE_WIDTH - ruleWidth) / 2, y: 450 },
    end: { x: (PAGE_WIDTH + ruleWidth) / 2, y: 450 },
    thickness: 2,
    color: COLORS.accent,
  });

  // ---- Body -----------------------------------------------------------
  drawCentered(page, "This certificate is proudly presented to", {
    y: 400,
    size: 16,
    font: italicFont,
    color: COLORS.text,
  });

  drawCentered(page, volunteerName, {
    y: 345,
    size: 34,
    font: titleFont,
    color: COLORS.nameColor,
  });

  // Underline beneath the recipient's name
  const nameWidth = titleFont.widthOfTextAtSize(volunteerName, 34);
  const nameUnderlineWidth = Math.max(nameWidth + 40, 260);
  page.drawLine({
    start: { x: (PAGE_WIDTH - nameUnderlineWidth) / 2, y: 330 },
    end: { x: (PAGE_WIDTH + nameUnderlineWidth) / 2, y: 330 },
    thickness: 1,
    color: COLORS.subtext,
  });

  drawCentered(
    page,
    `for dedicated service and commitment as an approved volunteer of ${orgName}.`,
    {
      y: 290,
      size: 15,
      font: bodyFont,
      color: COLORS.text,
    }
  );

  drawCentered(
    page,
    "We gratefully acknowledge the time, effort, and heart brought to this mission.",
    {
      y: 265,
      size: 12,
      font: italicFont,
      color: COLORS.subtext,
    }
  );

  // ---- Footer: date & signature -----------------------------------------
  const footerY = 130;
  const leftX = 130;
  const rightX = PAGE_WIDTH - 130;

  // Date block (left)
  page.drawLine({
    start: { x: leftX - 60, y: footerY },
    end: { x: leftX + 60, y: footerY },
    thickness: 1,
    color: COLORS.subtext,
  });
  const dateText = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dateWidth = bodyFont.widthOfTextAtSize(dateText, 12);
  page.drawText(dateText, {
    x: leftX - dateWidth / 2,
    y: footerY - 18,
    size: 12,
    font: bodyFont,
    color: COLORS.text,
  });
  page.drawText("Date Issued", {
    x: leftX - bodyFont.widthOfTextAtSize("Date Issued", 10) / 2,
    y: footerY - 34,
    size: 10,
    font: italicFont,
    color: COLORS.subtext,
  });

  // Signature block (right)
  page.drawLine({
    start: { x: rightX - 60, y: footerY },
    end: { x: rightX + 60, y: footerY },
    thickness: 1,
    color: COLORS.subtext,
  });
  const signLabel = "Authorized Signatory";
  page.drawText(signLabel, {
    x: rightX - bodyFont.widthOfTextAtSize(signLabel, 10) / 2,
    y: footerY - 18,
    size: 10,
    font: italicFont,
    color: COLORS.subtext,
  });
  page.drawText(orgName, {
    x: rightX - bodyFont.widthOfTextAtSize(orgName, 10) / 2,
    y: footerY - 34,
    size: 10,
    font: italicFont,
    color: COLORS.subtext,
  });

  // Center seal / emblem (simple circular badge using vector shapes)
  const sealX = PAGE_WIDTH / 2;
  const sealY = footerY;
  page.drawCircle({
    x: sealX,
    y: sealY,
    size: 26,
    borderColor: COLORS.accent,
    borderWidth: 2,
    color: rgb(1, 1, 1),
  });
  page.drawCircle({
    x: sealX,
    y: sealY,
    size: 20,
    borderColor: COLORS.primary,
    borderWidth: 1,
  });
  const sealText = "SEAL";
  page.drawText(sealText, {
    x: sealX - bodyFont.widthOfTextAtSize(sealText, 8) / 2,
    y: sealY - 3,
    size: 8,
    font: titleFont,
    color: COLORS.primary,
  });

  // Certificate ID (bottom-left corner, small print)
  const certId = `Cert. No: ${Date.now().toString(36).toUpperCase()}`;
  page.drawText(certId, {
    x: innerMargin + 12,
    y: innerMargin + 12,
    size: 8,
    font: bodyFont,
    color: COLORS.subtext,
  });

  return await pdfDoc.save();
};