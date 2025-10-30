import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/inter-full-variable.ttf"
          rel="preload"
          type="font/woff2"
        />
      </Head>
      <body>
        <InitColorSchemeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
