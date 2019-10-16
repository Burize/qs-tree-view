import { BindAll } from 'lodash-decorators';

import { Observer, ObserverHandler } from 'shared/helpers/Observer';
import { IEntity, EntityId } from 'shared/types/models/entity';

import { DatabaseRecords } from '../namespace';
import { initialEntities } from './initial';

const storageKeys = {
  entities: 'database.entities',
};

const EMPTY_STORAGE = 'Storage is empty when retrieving records';

interface IDeleteEntitiesResult {
  updatedEntities: IEntity[];
  modifiedEntitiesIds: Set<EntityId>;
}

@BindAll()
class DataBase {
  constructor(private observer: Observer) {
    this.initialize();
  }

  public onDatabaseUpdate(handler: ObserverHandler) {
    return this.observer.subscribe(handler);
  }

  public getEntities(): IEntity[] {
    const entities = this.getEntitiesFromStorage();
    return Object.values(entities);
  }

  public reset() {
    localStorage.setItem(storageKeys.entities, JSON.stringify(initialEntities));
    this.notifyDatabaseChanged();
  }

  public applyToDataBase(modifiedCacheEntities: IEntity[], allEntitiesIdsInCache: EntityId[]): IEntity[] {
    const { updatedEntities, modifiedEntitiesIds } = this.deleteEntities(modifiedCacheEntities);
    this.saveEntitiesArray(updatedEntities);

    const allEntitiesIdsInCacheMap = new Set(allEntitiesIdsInCache);
    return updatedEntities.filter(({ id }) => allEntitiesIdsInCacheMap.has(id) && modifiedEntitiesIds.has(id));
  }

  private deleteEntities(newEntities: IEntity[]): IDeleteEntitiesResult {
    const entities = this.getEntitiesFromStorage();

    const deletedEntitiesIds = new Set<EntityId>(
      newEntities
        .filter(entity => entities[entity.id] && !entities[entity.id].isRemoved && entity.isRemoved)
        .map(entity => entity.id),
    );

    const updatedEntities = Object.values(newEntities.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, { ...entities }));

    const modifiedEntitiesIds = new Set<EntityId>();
    newEntities
      .filter(e => deletedEntitiesIds.has(e.id))
      .forEach(entity => {
        this.deleteEntityChildren(updatedEntities, modifiedEntitiesIds, entity);
      });

    return { updatedEntities, modifiedEntitiesIds };
  }

  // In this case, it would be better to use immutable data (arguments),
  // but since the task states that the database is very large,
  // so recursive calls mutate their arguments.
  private deleteEntityChildren(allEntities: IEntity[], modifiedEntitiesIds: Set<EntityId>, entity: IEntity) {
    entity.isRemoved = true;
    modifiedEntitiesIds.add(entity.id);
    allEntities
      .filter(e => e.parentId === entity.id && !e.isRemoved)
      .forEach(e => {
        this.deleteEntityChildren(allEntities, modifiedEntitiesIds, e);
      });
  }

  private initialize() {
    const storageEntities = localStorage.getItem(storageKeys.entities);
    if (!storageEntities) {
      localStorage.setItem(storageKeys.entities, JSON.stringify(initialEntities));
    }
  }

  private getEntitiesFromStorage(): DatabaseRecords {
    const storageEntities = localStorage.getItem(storageKeys.entities);
    if (!storageEntities) {
      throw new Error(EMPTY_STORAGE);
    }
    return JSON.parse(storageEntities);
  }

  private saveEntitiesArray(entities: IEntity[]) {
    const entitiesMap = entities.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as DatabaseRecords);
    this.saveEntities(entitiesMap);
  }

  private saveEntities(entities: DatabaseRecords) {
    localStorage.setItem(storageKeys.entities, JSON.stringify(entities));
    this.notifyDatabaseChanged();
  }

  private notifyDatabaseChanged() {
    this.observer.notify();
  }
}

export default new DataBase(new Observer());
