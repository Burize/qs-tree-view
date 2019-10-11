import { IEntityNode, IEntity } from 'shared/types/models/entity';

export default function build(entities: IEntity[]): IEntityNode[] {
  const map = new Map([[null, []]]) as Map<null | string, IEntityNode[]>;

  entities.forEach((e) => {
    map.set(e.id, []);
  });

  return entities.reduce(
    (tree, { id, value, parentId, isRemoved }) => {

      const curr = tree.get(id)!;
      const parent = tree.get(parentId);
      if (Array.isArray(parent)) {
        parent.push(
          {
            entity: { id, value, parentId, isRemoved },
            children: curr,
          });
      } else {
        tree.get(null)!.push(
          {
            entity: { id, value, parentId, isRemoved },
            children: curr,
          });
      }

      return tree;
    },
    map,
  )
    .get(null)!;
}
