import { BindAll } from 'lodash-decorators';

import { Observer, ObserverHandler } from 'shared/helpers/Observer';
import { IEntity } from 'shared/types/models/entity';

import { DatabaseRecord } from '../namespace';
import { initialEntities } from './initial';

const storageKeys = {
  entities: 'database.entities',
};

@BindAll()
class DataBase {
  constructor(private observer: Observer) { }

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
    localStorage.removeItem(storageKeys.entities);
    this.notifyDatabaseChanged();
  }

  private getEntitiesFromStorage(): DatabaseRecord {
    const storageEntities = localStorage.getItem(storageKeys.entities);
    return storageEntities ? JSON.parse(storageEntities) : initialEntities;
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

  private saveEntities(entities: DatabaseRecord) {
    localStorage.setItem(storageKeys.entities, JSON.stringify(entities));
    this.notifyDatabaseChanged();
  }

  private notifyDatabaseChanged() {
    this.observer.notify();
  }
}

export default new DataBase(new Observer());
