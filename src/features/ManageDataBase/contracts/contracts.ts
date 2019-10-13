import { database } from '../state';
import { IDatabaseProviderContract } from '../namespace';

export const databaseContract: IDatabaseProviderContract = {
  applyToDataBase: database.applyToDataBase,
  reset: database.reset,
};
