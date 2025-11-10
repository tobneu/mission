import { notFound } from 'next/navigation';
import TaskClient from '@/components/TaskClient';
import { taskIdFromCode } from '@/lib/tokenUtils';

export default async function Page({ params }: { params: any }) {
  // `params` can be a promise in the app-router; await it before accessing properties
  const { code } = await params;
  const id = taskIdFromCode(code);
  if (!id) return notFound();
  return <TaskClient taskId={id} />;
}
