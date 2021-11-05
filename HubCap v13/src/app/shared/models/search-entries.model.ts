import { PathCollectionModel } from './path-collection.model';
import { EntriesModel } from './entries.model';
import { UserModel } from './user.model';
export class SearchEntriesModel {
  type: string | null = null;
  id: string | null = null;
  sequence_id: string | null = null;
  etag: string | null = null;
  name: string | null = null;
  created_at: string | null = null;
  modified_at: string | null = null;
  description: string | null = null;
  size: string | null = null;
  path_collection: PathCollectionModel | null = null;
  created_by: UserModel | null = null;
  modified_by: UserModel | null = null;
  owned_by: UserModel | null = null;
  parent: EntriesModel | null = null;

}
