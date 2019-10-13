import { IEntity } from 'shared/types/models/entity';

export interface IDatabaseProviderContract {
  applyToDataBase(entities: IEntity[]): void;
  reset(): void;

}

export type DatabaseRecords = Record<string, IEntity>;
