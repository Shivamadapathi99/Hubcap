export const environment = {
  production: true
};

// Box
export const AUTH_SETTINGS = {
  auth: {
    domain: `https://account.box.com/api/oauth2/authorize`,
    clientId: 'b2lrpcajmjci65m3lad35xxqdak7kno9',
    clientSecret: 'RGOrFZvK9ZIOwUm5G7f34FrzyG7O0wu1',
    redirectUri: window.location.origin
  }
}

// Okta
export const OKTA_SETTINGS = {
  clientId: '0oaseoigriQTJ55z80x7', //localhost
  redirectUri: 'http://localhost:4200/login/callback', //localhost
  issuer: 'https://capspecialty.okta.com',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  tokenManager: {
    storage: 'sessionStorage'
  },
  storageManager: {
    token: {
      storageTypes:'cookie',
      useMultipleCookies: true
    }},
    cache: {
      storageTypes:'cookie',
    }, 
    transaction: {
      storageTypes:'cookie',
    },
    authorizeUrl: 'https://capspecialty.okta.com/oauth2/v1/authorize',
    expiresAt: 2,
  };

