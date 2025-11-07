import dynamic from 'next/dynamic';
import Head from 'next/head';

import { observer } from 'mobx-react-lite';

const DynamicInsights = dynamic(
  () => import('@/components/organisms/Insights').then((mod) => mod.Insights),
  {
    ssr: false,
  },
);

const PortfolioPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="Corepass Software Team" name="description" />
        <meta content="Loan Servicing System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicInsights />
    </>
  );
});

export default PortfolioPage;
