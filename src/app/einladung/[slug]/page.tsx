import { redirect } from 'next/navigation';
import { generateToken } from '@/lib/tokenUtils';
import StepperForm from '@/components/StepperForm';
import type { Metadata } from 'next';

type EinladungPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: EinladungPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const parts = slug.split('-');
  parts.pop(); // Remove token
  const name = parts.join(' ');
  
  const formattedName = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Pick a random image (1-7)
  const randomImage = Math.floor(Math.random() * 5) + 1;
  const imageUrl = `/images/${randomImage}.jpg`;

  const title = `${formattedName}, du bist eingeladen! 🎉`;
  const description = `${formattedName}, du bist herzlich zu meiner Geburtstagsparty eingeladen! Bitte klicke den Link um die Mission zu starten! 🎂🎊`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Geburtstagsparty Einladung',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EinladungPage({ params }: EinladungPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const parts = slug.split('-');
  const token = parts.pop();
  const name = parts.join(' ');

  const expectedToken = generateToken(name, process.env.BIRTHDAY_SECRET!);

  if (token !== expectedToken) {
    redirect('/honeypot');
  }

  const formattedName = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return <StepperForm name={formattedName} />;
}
