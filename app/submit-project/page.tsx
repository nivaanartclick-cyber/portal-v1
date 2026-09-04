import SiteLayout from '@/components/SiteLayout';
import SubmitProjectPage from '@/components/pages/SubmitProjectPage';

type Props = {
  searchParams: Promise<{ service?: string }>;
};

export default async function SubmitProjectRoute({ searchParams }: Props) {
  const params = await searchParams;
  const preselectedService = params.service ?? '';

  return (
    <SiteLayout>
      <SubmitProjectPage preselectedService={preselectedService} />
    </SiteLayout>
  );
}
