'use client';

import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const cookies = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // Token expires in 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  }
};