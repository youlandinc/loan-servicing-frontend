import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

import Head from 'next/head';

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
        <meta content="YouLand Software Team" name="description" />
        <meta content="YouLand Loan Servicing System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicInsights />
    </>
  );
});

export default PortfolioPage;
