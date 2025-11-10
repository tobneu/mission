import { NextRequest, NextResponse } from 'next/server';
import { questions } from '@/lib/questions';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Generate QR codes and create PDF
    const pdfPath = await generateQRPdf();

    // Log download link to console (admin access)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/api/qr-codes/download?file=${encodeURIComponent(pdfPath)}`;
    console.log('========================================');
    console.log('QR CODES PDF GENERATED');
    console.log('Download link:', downloadUrl);
    console.log('========================================');

    // Return simple message to user
    return new NextResponse('Check console', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Error generating QR codes PDF:', error);
    return NextResponse.json({ error: 'Failed to generate QR codes PDF' }, { status: 500 });
  }
}

async function generateQRPdf(): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const qrSize = 40; // mm
  const spacing = 15; // mm

  // Calculate positions for alternating layout
  const leftX = margin;
  const rightX = pageWidth - margin - qrSize;
  const topY = margin;

  let currentY = topY;
  let qrCount = 0;

  // New layout: center QR on each row, put "Frage N" above the QR and full URL below it.
  // Remove alternating left/right logic. Keep 4 per page.
  const centerX = (pageWidth - qrSize) / 2;

  for (const question of questions) {
    // Start a new page every 4 QR codes
    if (qrCount % 4 === 0 && qrCount > 0) {
      doc.addPage();
      currentY = topY;
    }

    const qrX = centerX;
    const qrY = currentY;

    try {
      // Generate QR code as data URL
      const stationCode = (await import('@/lib/tokenUtils')).generateTaskCode(question.id);
      const qrDataUrl = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/task/${stationCode}`, {
        width: 200,
        margin: 1
      });

      // Draw title above QR (centered)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Frage ${question.id}`, pageWidth / 2, qrY - 6, { align: 'center' });

      // Add QR code image (centered)
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Add full URL below the QR (centered)
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/task/${stationCode}`;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(fullUrl, pageWidth / 2, qrY + qrSize + 6, { align: 'center' });

      // Move down one row after placing a single centered QR + texts
      currentY += qrSize + spacing + 12; // extra space for URL
      qrCount++;

    } catch (error) {
      console.error(`Error generating QR code for question ${question.id}:`, error);
      // Continue with next question
    }
  }

  // Generate PDF as buffer and save to temp file
  const tempDir = tmpdir();
  const fileName = `qr-codes-${Date.now()}.pdf`;
  const filePath = join(tempDir, fileName);

  const pdfBuffer = doc.output('arraybuffer');
  writeFileSync(filePath, Buffer.from(pdfBuffer));

  return filePath;
}