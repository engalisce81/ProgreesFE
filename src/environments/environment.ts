import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'Progress',
    logoUrl: 'https://i.postimg.cc/1RvZJShw/Whats-App-Image-2025-09-13-at-21-54-29-e593bcc7.jpg',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44318/',
    redirectUri: baseUrl,
    clientId: 'Acadmy_App',
    responseType: 'code',
    scope: 'offline_access Acadmy',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44318',
      rootNamespace: 'Dev.Progress',
    },
  },
} as Environment; 