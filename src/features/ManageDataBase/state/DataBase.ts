import { BindAll } from 'lodash-decorators';

import { Observer, ObserverHandler } from 'shared/helpers/Observer';
import { IEntity } from 'shared/types/models/entity';

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

  public applyToDataBase(updatedEntities: IEntity[]) {
    const entities = this.getEntitiesFromStorage();
    const entitiesArray = Object.values(entities);

    updatedEntities.forEach(entity => {
      const isNeedRemoveChildren = entities[entity.id] && !entities[entity.id].isRemoved && entity.isRemoved;
      entities[entity.id] = entity;
      if (isNeedRemoveChildren) {
        this.deleteEntityChildren(entitiesArray, entity);
      }
    });

    this.saveEntities(entities);
  }

  public reset() {
    localStorage.setItem(storageKeys.entities, JSON.stringify(initialEntities));
    this.notifyDatabaseChanged();
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

  private deleteEntityChildren(allEntities: IEntity[], entity: IEntity) {
    entity.isRemoved = true;
    allEntities
      .forEach(e => {
        if (e.parentId === entity.id && !e.isRemoved) {
          this.deleteEntityChildren(allEntities, e);
        }
      });
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
