import { IEntity } from 'shared/types/models/entity';

export interface ICacheProviderContract {
  addToCache(entity: IEntity): void;
  reset(): void;
}

export type CacheRecords = Record<string, IEntity>;
