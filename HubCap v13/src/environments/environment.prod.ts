export const environment = {
  production: true
};

// Okta
export const AUTH_SETTINGS = {
  auth:{
   domain: `https://account.box.com/api/oauth2/authorize`,
   clientId: '7ti4hikf5cfuj8s6efjzmressy3j49sp',
   clientSecret: 'uSTXCjV1fX4RTfmcE7bHL90Y9l9JbIaR',
   redirectUri: window.location.origin
 }
};


// Box
export const OKTA_SETTINGS = {
 clientId: '0oas91xevg94traZU0x7', //production
 redirectUri: 'https://d2qegrs4hypk6m.cloudfront.net/login/callback',
 
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
  }
}

