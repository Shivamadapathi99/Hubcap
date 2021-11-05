import { UserClaims } from "@okta/okta-auth-js";

export class StateModel {
  boxSearch: BoxSearchModel | null = new BoxSearchModel;
  boxToken: BoxTokenModel | null = new BoxTokenModel;
  createWork: CreateWorkModel | null = new CreateWorkModel;
  dashboard: DashboardModel = new DashboardModel;
  queue: QueueModel = new QueueModel;
  user: UserClaims | null | undefined = null;
}

export class BoxSearchModel {
}

export class BoxTokenModel {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  createdDate: string | null = null;
  modifiedDate?: string | null = null;
}

export class CreateWorkModel {
}

export class DashboardModel {
  quickLinks: Array<QuickLinksModel> = [];
}

export class QueueModel {
  columnTitles: Array<any> = [];
  data: Array<any> = [];
  displayColumns: Array<any> = [];
  pipes: Array<any> = [];
  rawData: Object = {};
}

export class QuickLinksModel {
  title: string = '';
  url: string = '';
  windowTarget: string = '';
}
