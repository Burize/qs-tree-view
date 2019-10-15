import { IEntity, EntityId } from 'shared/types/models/entity';

export interface ICacheProviderContract {
  addToCache(entity: IEntity, parentsIds: EntityId[]): void;
  updateCache(entities: IEntity[]): void;
  reset(): void;
}

export type CacheRecords = Record<string, IEntity>;
