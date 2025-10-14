import { redirect } from 'next/navigation';
import { generateToken } from '@/lib/tokenUtils';
import StepperForm from '@/components/StepperForm';

type EinladungPageProps = {
  params: {
    slug: string;
  };
};

export default async function EinladungPage({ params }: EinladungPageProps) {
  const { slug } = await params;
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
