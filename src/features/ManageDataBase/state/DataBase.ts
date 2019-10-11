import { IEntity } from 'shared/types/models/entity';

const initialEntities: IEntity[] = [
  { id: '1', value: 'Node1', parentId: null, isRemoved: false },
  { id: '2', value: 'Node2', parentId: null, isRemoved: false },
  { id: '3', value: 'Node3', parentId: '1', isRemoved: false },
  { id: '4', value: 'Node4', parentId: '2', isRemoved: false },
  { id: '5', value: 'Node5', parentId: '3', isRemoved: false },
  { id: '6', value: 'Node6', parentId: '3', isRemoved: false },
];

class DataBase {

  public async getAllEntities(): Promise<IEntity[]> {
    return initialEntities;
  }
}

export default new DataBase();
