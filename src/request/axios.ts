import axios from 'axios';

import { rootStore } from '@/models/Root';

import { REQUEST_TIMEOUT } from '@/constant';

import { HttpError, HttpErrorType, HttpVariant } from '@/types/common';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

// todo request interceptors & response interceptors

// service.interceptors.request.use((config) => {
//   if (rootStore.session) {
//     config.headers.Authorization = `Bearer ${rootStore.session.idToken.jwtToken}`;
//   }

//   return config;
// });

service.interceptors.request.use(
  (config) => {
    const token =
      rootStore?.session?.idToken?.jwtToken ||
      localStorage?.getItem('USER_LOGIN_INFORMATION');

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject({
      message: error.message,
      header: '',
      variant: HttpVariant.error,
    });
  },
);

service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { code } = error;

    let notificationObj: HttpError = {
      message: '',
      header: '',
      variant: HttpVariant.error,
    };

    if (error.response) {
      const { message, header, variant, code } = error.response.data;
      notificationObj = {
        message,
        header,
        variant,
      };
      if (code === HttpErrorType.tokenExpired) {
        rootStore.logout();
      }
    }

    if (code === 'ECONNABORTED') {
      notificationObj = {
        message: 'A system error has occurred.',
        header: '',
        variant: HttpVariant.error,
      };
    }

    if (code === 'ERR_NETWORK') {
      notificationObj = {
        message:
          'Unable to connect to the server. Please check your network connection and try again.',
        header: 'Network Error',
        variant: HttpVariant.error,
      };
    }

    return Promise.reject(notificationObj);
  },
);

export const { get, post, put, delete: del } = service;
