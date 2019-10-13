import { database } from '../state';
import { IDataBaseProviderContract } from '../namespace';

export const databaseContract: IDataBaseProviderContract = {
  applyToDataBase: database.applyToDataBase,
  reset: database.reset,
};
