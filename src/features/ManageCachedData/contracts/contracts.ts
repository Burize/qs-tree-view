import { cacheStorage } from '../state';
import { ICacheProviderContract } from '../namespace';

export const cacheContract: ICacheProviderContract = {
  addToCache: cacheStorage.addToCache,
  reset: cacheStorage.reset,
};
