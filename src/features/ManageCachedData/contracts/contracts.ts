import { cacheStorage } from '../state';
import { ICacheProviderContract } from '../namespace';

export const cacheContract: ICacheProviderContract = {
  addToCache: cacheStorage.addToCache,
  updateCache: cacheStorage.updateCache,
  reset: cacheStorage.reset,
};
