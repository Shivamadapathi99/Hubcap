// const { CLIENT_ID, ISSUER, OKTA_TESTING_DISABLEHTTPSCHECK } = process.env;
//production
// export default {
//   oidc: {
//     clientId: `0oas91xevg94traZU0x7`,
//     issuer: `https://capspecialty.okta.com`,
//     redirectUri: 'https://d3055tmgraqhtr.cloudfront.net/login/callback',
//     scopes: ['openid', 'profile', 'email'],
//     pkce: true,

//   },
//   resourceServer: {
//     messagesUrl: 'https://d3055tmgraqhtr.cloudfront.net/api/messages',
//   },
// };
 //localhost setup
export default {
  oidc: {
    clientId: `0oas91xevg94traZU0x7`,
    issuer: `https://capspecialty.okta.com`, //issuer: `https://capspecialty.okta.com`,
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    // testing: {
    //   disableHttpsCheck: true
    // }
  },
  resourceServer: {
    // messagesUrl: 'http://localhost:8080/api/messages',
  },
};
