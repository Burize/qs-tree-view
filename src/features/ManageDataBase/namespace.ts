import { IEntity } from 'shared/types/models/entity';

export interface IDataBaseProviderContract {
  applyToDataBase(entities: IEntity[]): void;
  reset(): void;

}

export type DatabaseRecord = Record<string, IEntity>;
