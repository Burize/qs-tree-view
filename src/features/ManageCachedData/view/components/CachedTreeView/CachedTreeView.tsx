import * as React from 'react';
import { BindAll } from 'lodash-decorators';

import { block } from 'shared/helpers/bem';
import { TreeNode, Tree } from 'shared/view/elements';
import { EntityId, IEntityNode } from 'shared/types/models/entity';

const b = block('cached-tree-view');

interface IProps {
  entities: IEntityNode[];
  selectedNodeId: EntityId | null;
  onSelect(id: EntityId): void;
}

@BindAll()
export class CachedTreeView extends React.PureComponent<IProps> {
  public render() {
    const { entities, selectedNodeId } = this.props;
    return (
      <div className={b()}>
        {entities.length !== 0 && (
          <Tree
            selectedKeys={selectedNodeId !== null ? [selectedNodeId] : undefined}
            onSelect={this.selectNode}
            defaultExpandAll
          >
            {this.makeEntitiesTree(entities)}
          </Tree>
        )}
      </div>
    );
  }

  private makeEntitiesTree(entities: IEntityNode[]) {
    return entities.map(({ entity, children }) => (
      <TreeNode
        title={entity.value}
        key={entity.id}
      >
        {children.length !== 0 && this.makeEntitiesTree(children)}
      </TreeNode>
    ));
  }

  private selectNode(selectedNodeIds: string[]) {
    this.props.onSelect(selectedNodeIds[0]);
  }
}
