interface ICacheProviderContract {
  addToCache(entity: IEntity): void;
}

import { cacheStorage } from '../state';
import { IEntity } from 'shared/types/models/entity';

export const cacheContract: ICacheProviderContract = {
  addToCache: cacheStorage.addToCache,
};
