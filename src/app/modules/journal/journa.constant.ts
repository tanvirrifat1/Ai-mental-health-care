import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { IJournal } from './journal.interface';

export const generateJournalPdf = async (journal: IJournal) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { title, description, userId, date, type, heading } = journal;

  const text = [
    `Journal Title: ${title || 'N/A'}`,
    `Type: ${type}`,
    `Date: ${date.toDateString()}`,
    `Heading: ${heading}`,
    `Description: ${description}`,
  ].join('\n\n');

  page.drawText(text, {
    x: 50,
    y: 700,
    size: 14,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 24,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
