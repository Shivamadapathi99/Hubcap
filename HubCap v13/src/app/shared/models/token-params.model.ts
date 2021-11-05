export class TokenParamsModel {
  // grant_type: string;
  // code: string;
  // client_id: string;
  // client_secret: string;
  access_token: string | null = null;
  expires_in: string | null = null;
  restricted_to?: string | null = null;
  refresh_token: string | null = null;
  token_type: string | null = null;
}
