import { SearchEntriesModel } from "./search-entries.model";

export class SearchQueryModel {
  total_count: string | null = null;
  entries: SearchEntriesModel[] | null = null;
}

