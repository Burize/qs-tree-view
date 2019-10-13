import { bindAll } from 'lodash-decorators';
import * as uuid from 'uuid';

import { IEntity, EntityId } from 'shared/types/models/entity';
import { Observer, ObserverHandler } from 'shared/helpers/Observer';

import { CacheRecords } from '../namespace';

const storageKeys = {
  entities: 'cache.entities',
  modifiedEntities: 'cache.modifiedEntities',
};

const ENTITY_IS_NOT_EXIST = 'Entity with specified id was not found when updating';
const ENTITY_ALREADY_EXIST = 'Entity with specified id already exist';

@bindAll()
class CacheStorage {
  constructor(private observer: Observer) { }

  public onCacheChange(handler: ObserverHandler) {
    return this.observer.subscribe(handler);
  }

  public getEntities(): IEntity[] {
    const entities = this.getEntitiesFromStorage();
    return Object.values(entities);
  }

  public addToCache(entity: IEntity) {
    const entities = this.getEntitiesFromStorage();
    if (entities[entity.id]) {
      throw new Error(ENTITY_ALREADY_EXIST);
    }

    entities[entity.id] = entity;
    localStorage.setItem(storageKeys.entities, JSON.stringify(entities));
    this.notifyCacheChanged();
  }

  public createEntity(value: string, parentId: EntityId) {
    const entities = this.getEntitiesFromStorage();

    const newEntity: IEntity = { id: uuid(), value, parentId, isRemoved: false };
    entities[newEntity.id] = newEntity;

    this.setModifiedEntity(newEntity.id);
    this.saveEntities(entities);
  }

  public updateEntity(id: EntityId, value: string) {
    const entities = this.getEntitiesFromStorage();
    if (!entities[id]) {
      throw new Error(ENTITY_IS_NOT_EXIST);
    }

    entities[id].value = value;
    this.setModifiedEntity(id);
    this.saveEntities(entities);
  }

  public deleteEntity(id: EntityId) {
    const entities = this.getEntitiesFromStorage();
    if (!entities[id]) {
      throw new Error(ENTITY_IS_NOT_EXIST);
    }

    this.deleteEntityChildren(Object.values(entities), entities[id]);
    this.setModifiedEntity(id);
    this.saveEntities(entities);
  }

  public getModifiedEntities(): IEntity[] {
    const entities = this.getEntities();
    const modifiedEntitiesIds = this.getModifiedEntitiesIds();
    return entities.filter(e => modifiedEntitiesIds[e.id]);
  }

  public onCacheApplied() {
    localStorage.removeItem(storageKeys.modifiedEntities);
  }

  public reset() {
    localStorage.removeItem(storageKeys.entities);
    localStorage.removeItem(storageKeys.modifiedEntities);
    this.notifyCacheChanged();
  }

  private getEntitiesFromStorage(): CacheRecords {
    const storageEntities = localStorage.getItem(storageKeys.entities);
    return storageEntities ? JSON.parse(storageEntities) : {};
  }

  private deleteEntityChildren(allEntities: IEntity[], entity: IEntity) {
    entity.isRemoved = true;
    allEntities.forEach(e => {
      if (e.parentId === entity.id && !e.isRemoved) {
        this.deleteEntityChildren(allEntities, e);
      }
    });
  }

  private notifyCacheChanged() {
    this.observer.notify();
  }

  private saveEntities(entities: CacheRecords) {
    localStorage.setItem(storageKeys.entities, JSON.stringify(entities));
    this.notifyCacheChanged();
  }

  private getModifiedEntitiesIds(): Record<string, true> {
    const storageModifiedEntityIds = localStorage.getItem(storageKeys.modifiedEntities);
    return storageModifiedEntityIds ? JSON.parse(storageModifiedEntityIds) : {};
  }

  private setModifiedEntity(id: EntityId) {
    const modifiedEntitiesIds = this.getModifiedEntitiesIds();
    modifiedEntitiesIds[id] = true;
    localStorage.setItem(storageKeys.modifiedEntities, JSON.stringify(modifiedEntitiesIds));
  }

}

export default new CacheStorage(new Observer());
