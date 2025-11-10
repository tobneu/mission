import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { tmpdir } from 'os';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePathParam = searchParams.get('file');

    if (!filePathParam) {
      return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
    }

    // Decode the URL-encoded file path
    const filePath = decodeURIComponent(filePathParam);

    // Security check - only allow files from temp directory and with qr-codes prefix
    const tempDir = tmpdir();
    const fileName = filePath.split(/[/\\]/).pop() || '';

    if (!filePath.startsWith(tempDir) || !fileName.startsWith('qr-codes-')) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 403 });
    }

    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Error downloading QR codes PDF:', error);
    return NextResponse.json({ error: 'File not found or expired' }, { status: 404 });
  }
}