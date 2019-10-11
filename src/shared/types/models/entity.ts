import { Flavoring } from '../utils';

export interface IEntityNode {
  entity: IEntity;
  children: IEntityNode[];
}

export interface IEntity {
  id: EntityId;
  parentId: EntityId | null;
  value: string;
  isRemoved: boolean;
}

export type EntityId = Flavoring<'EntityId', string>;
