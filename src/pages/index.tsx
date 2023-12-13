import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

//const DynamicEntrance = dynamic(
//  () => import('@/views/EntrancePage').then((mod) => mod.EntrancePage),
//  {
//    ssr: true,
//  },
//);

const Index = observer(() => {
  return (
    <>
      <Head>
        <meta content="YouLand Software Team" name="description" />
        <meta content="YouLand Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {/*<DynamicEntrance />*/}
    </>
  );
});

export default Index;
