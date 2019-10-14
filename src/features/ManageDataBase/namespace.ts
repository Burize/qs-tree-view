import { IEntity, EntityId } from 'shared/types/models/entity';

export interface IDatabaseProviderContract {
  applyToDataBase(entities: IEntity[], allEntitiesIds: EntityId[]): IEntity[];
  reset(): void;
}

export type DatabaseRecords = Record<string, IEntity>;
