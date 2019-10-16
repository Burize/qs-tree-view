import { BindAll } from 'lodash-decorators';

import { Observer, ObserverHandler } from 'shared/helpers/Observer';
import { IEntity, EntityId } from 'shared/types/models/entity';

import { DatabaseRecords } from '../namespace';
import { initialEntities } from './initial';

const storageKeys = {
  entities: 'database.entities',
};

const EMPTY_STORAGE = 'Storage is empty when retrieving records';

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

  public getEntityAncestors(id: EntityId): EntityId[] {
    const entities = this.getEntitiesFromStorage();

    const ancestorsIds = new Set<EntityId>();

    const parentId = entities[id].parentId;

    let parent: IEntity | null = parentId && entities[parentId];
    while (parent) {
      ancestorsIds.add(parent.id);
      parent = parent.parentId && entities[parent.parentId];
    }

    return [...ancestorsIds];
  }

  public applyToDataBase(modifiedCacheEntities: IEntity[], allEntitiesIdsInCache: EntityId[]): IEntity[] {
    const databaseEntities = this.getEntitiesFromStorage();
    const deletedEntitiesIds = new Set<EntityId>(
      modifiedCacheEntities
        .filter(entity => databaseEntities[entity.id] && !databaseEntities[entity.id].isRemoved && entity.isRemoved).
        map(entity => entity.id),
    );

    const modifiedDatabaseEntities = Object.values(
      modifiedCacheEntities.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, databaseEntities));

    const [finalEntities, updatedEntitiesIds] =
      this.deleteEntities(modifiedDatabaseEntities, modifiedCacheEntities, deletedEntitiesIds);
    this.saveEntitiesArray(finalEntities);

    const allEntitiesIdsInCacheMap = new Set(allEntitiesIdsInCache);
    return finalEntities
      .filter(e => updatedEntitiesIds.has(e.id) && allEntitiesIdsInCacheMap.has(e.id));
  }

  public reset() {
    localStorage.setItem(storageKeys.entities, JSON.stringify(initialEntities));
    this.notifyDatabaseChanged();
  }

  private deleteEntities(
    allEntities: IEntity[],
    modifiedEntities: IEntity[],
    deletedEntitiesIds: Set<EntityId>): [IEntity[], Set<EntityId>] {
    const updatedEntitiesIds = new Set<EntityId>();
    modifiedEntities.forEach(entity => {
      if (deletedEntitiesIds.has(entity.id)) {
        this.deleteEntityChildren(allEntities, updatedEntitiesIds, entity);
      }
    });

    return [[...allEntities], updatedEntitiesIds];
  }

  // In this case, it would be better to use immutable data (arguments),
  // but since the task states that the database is very large,
  // so recursive calls mutate their arguments.
  private deleteEntityChildren(allEntities: IEntity[], updatedEntities: Set<EntityId>, entity: IEntity) {
    entity.isRemoved = true;
    updatedEntities.add(entity.id);
    allEntities
      .forEach(e => {
        if (e.parentId === entity.id && !e.isRemoved) {
          this.deleteEntityChildren(allEntities, updatedEntities, e);
        }
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
    const finalEntitiesMap = entities.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as DatabaseRecords);
    this.saveEntities(finalEntitiesMap);
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
