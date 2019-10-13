import * as React from 'react';
import { BindAll, memoize } from 'lodash-decorators';

import { block } from 'shared/helpers/bem';
import { TreeNode, Tree } from 'shared/view/elements';
import { EntityId, IEntityNode } from 'shared/types/models/entity';

import './DBTreeView.scss';

const b = block('db-tree-view');

interface IProps {
  entities: IEntityNode[];
  selectedNodeId: EntityId | null;
  onSelect(id: EntityId | null): void;
}

@BindAll()
export class DBTreeView extends React.PureComponent<IProps> {
  public render() {
    const { entities, selectedNodeId } = this.props;
    return (
      <div className={b()}>
        {entities.length !== 0 && (
          <Tree
            selectedKeys={selectedNodeId !== null ? this.getSelectedNodeIdArray(selectedNodeId) : undefined}
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
        key={entity.id}
        className={b('node', { removed: entity.isRemoved })}
        title={entity.value}
        expanded
      >
        {children.length !== 0 && this.makeEntitiesTree(children)}
      </TreeNode>
    ));
  }

  private selectNode(selectedNodeIds: string[]) {
    this.props.onSelect(selectedNodeIds[0] || null);
  }

  @memoize
  private getSelectedNodeIdArray(id: EntityId) {
    return [id];
  }
}
