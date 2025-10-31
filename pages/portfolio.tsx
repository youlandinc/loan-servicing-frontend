import dynamic from 'next/dynamic';
import Head from 'next/head';

import { observer } from 'mobx-react-lite';

const DynamicPortfolio = dynamic(
  () => import('@/components/organisms/Portfolio').then((mod) => mod.Portfolio),
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
      <DynamicPortfolio />
    </>
  );
});

export default PortfolioPage;
