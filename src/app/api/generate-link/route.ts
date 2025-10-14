import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/tokenUtils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name query parameter is required' }, { status: 400 });
  }

  const secret = process.env.BIRTHDAY_SECRET;

  if (!secret) {
    console.error('BIRTHDAY_SECRET is not set in .env.local');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const slugName = name.toLowerCase().replace(/ /g, '-');
  const token = generateToken(name.toLowerCase(), secret);
  const url = `/einladung/${slugName}-${token}`;

  // Log to the server console
  console.log(`Generated link for ${name}: ${url}`);

  // Return the link in the response
  return NextResponse.json({ name, url });
}
