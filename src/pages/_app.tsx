import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import Head from 'next/head';
import { AppProps } from 'next/app';
import { Router } from 'next/router';

import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@/styles/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from '@/theme';

import NProgress from 'nprogress';
import { SnackbarProvider } from 'notistack';

import 'normalize.css';
import 'reset.css';
import '@/styles/global.css';

import { StyledNotification } from '@/components/atoms';

import { useBreakpoints } from '@/hooks';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const breakpoints = useBreakpoints();

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);
    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          name="viewport"
        />
        <title>YouLand</title>
      </Head>

      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: ['sm', 'xs'].includes(breakpoints) ? 'center' : 'right',
          }}
          Components={{
            success: StyledNotification,
            error: StyledNotification,
            default: StyledNotification,
            info: StyledNotification,
            warning: StyledNotification,
          }}
          maxSnack={3}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
