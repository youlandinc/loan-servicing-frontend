import React, { useEffect } from 'react';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import Script from 'next/script';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import NProgress from 'nprogress';

import { Provider, rootStore } from '@/models/Root';

import { useBreakpoints } from '@/hooks';
import createEmotionCache from '@/styles/createEmotionCache';
import { lightTheme } from '@/theme';

import { StyledNotification } from '@/components/atoms';

import 'normalize.css';
import 'reset.css';
import '@/styles/global.css';

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

    if (localStorage && localStorage.getItem('USER_LOGIN_INFORMATION')) {
      rootStore.injectCognitoUserSession({
        accessToken: localStorage.getItem('USER_LOGIN_INFORMATION') as string,
        refreshToken: '',
      });
    }

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <>
      <Provider value={rootStore}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              content="initial-scale=1, width=device-width"
              name="viewport"
            />
            <meta
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
              name="viewport"
            />
            <link href={'/favicon.svg'} rel="icon" />
            <title>Servicing Center</title>
          </Head>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'top',
                horizontal: ['sm', 'xs'].includes(breakpoints)
                  ? 'center'
                  : 'right',
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
      </Provider>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbKnoaYuPycOQD4uQdPrc1nESFEVRH5-g&libraries=places,streetView,maps"
        type="text/javascript"
      />
    </>
  );
}
