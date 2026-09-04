import SiteLayout from '@/components/SiteLayout';
import RequestRevisionPage from '@/components/pages/RequestRevisionPage';

type Props = { searchParams: Promise<{ ticket?: string }> };

export default async function RequestRevisionRoute({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <SiteLayout>
      <RequestRevisionPage prefillTicket={params.ticket ?? ''} />
    </SiteLayout>
  );
}
