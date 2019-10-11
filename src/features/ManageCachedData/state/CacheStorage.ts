import { IEntity } from 'shared/types/models/entity';
import { bindAll } from 'lodash-decorators';

const storageKeys = {
  cachedEntities: 'cachedEntities',
};

type onCacheChangeHandler = () => void;

@bindAll()
class CacheStorage {
  private subscribers: onCacheChangeHandler[] = [];

  public onCacheChange(handler: onCacheChangeHandler) {
    this.subscribers.push(handler);
    return () => this.unsubscribe(handler);
  }

  public getEntities(): IEntity[] {
    const storageEntities = localStorage.getItem(storageKeys.cachedEntities);
    return storageEntities ? JSON.parse(storageEntities) : [];
  }

  public addToCache(entity: IEntity) {
    const storageEntities = localStorage.getItem(storageKeys.cachedEntities);
    const entities: IEntity[] = storageEntities ? JSON.parse(storageEntities) : [];
    if (entities.findIndex(e => e.id === entity.id) !== -1) {
      return;
    }

    entities.push(entity);
    localStorage.setItem(storageKeys.cachedEntities, JSON.stringify(entities));
    this.dispatchCacheChangeEvent();
  }

  private dispatchCacheChangeEvent() {
    this.subscribers.forEach(handler => handler());
  }

  private unsubscribe(handler: onCacheChangeHandler) {
    const handlerIndex = this.subscribers.indexOf(handler);
    this.subscribers.splice(handlerIndex, 1);
  }

}

export default new CacheStorage();
