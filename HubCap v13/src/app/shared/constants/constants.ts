export const API_BASE_PATH = 'https://gtx79l3vg8.execute-api.us-east-2.amazonaws.com/V1/hubcap/';

export const BOX_URL = 'https://app-capspecialty.app.box.com/';

export const DEFAULT_BOX_FOLDER_ID = '0';

export const LOCAL_STORAGE_DURATION = 60000;

export const TABS_MAIN = [
  'dashboard',
  'my-queue',
  'team-queue',
  'create-work',
  'file-search'
];

/*export const SMARTSHEET_SETTINGS = {
  sheetId: 2599538235074436,
  smartsheetUrl: `https://g2ca431m8k.execute-api.us-east-1.amazonaws.com/smartAPI/smartsheet`,
  queueSheetId: 2255339555972996,
  queueSheetUrl: `/rows`,
  packageSheetId: 8968253180536708
  // taskNameColumnId: 5315473796556676,
  // doneColumnId: 5315473796556676
};*/

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
  pkce: true
};
