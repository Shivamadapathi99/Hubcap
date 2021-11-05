export class CreateWorkFormControlModel {
  id: string | null = null;
  formControlName: string | null = null;
  value: any | null = null;
  values: any[] | null = null;
}

export class CreateWorkSubmissionModel {
  formId: string | null = null;
  formName: string | null = null;
  itemId?: string | null = null;
  requestType: string | null = null;
  formData: Array<CreateWorkFormControlModel> = [];
  requestId: string | null = null;
  requesterEmail: string | null | undefined = null;
}
