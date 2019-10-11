import * as React from 'react';
import { BindAll, memoize } from 'lodash-decorators';

import { EntityId, IEntity } from 'shared/types/models/entity';
import { Button } from 'shared/view/elements';
import buildEntitiesTree from 'shared/helpers/buildEntitiesTree';
import { block } from 'shared/helpers/bem';

import { DBTreeView } from '../../components';
import { dataBase } from '../../../state';
// import './DBTreeView.scss';

interface IProps {
  onLoadToCache(entity: IEntity): void;
}

interface IState {
  entities: IEntity[];
  selectedEntityId: EntityId | null;
}

const b = block('DB-view');

@BindAll()
export class DBView extends React.PureComponent<IProps, IState> {
  public state: IState = { entities: [], selectedEntityId: null };

  public componentDidMount() {
    this.loadEntities();
  }

  public render() {
    const { entities, selectedEntityId } = this.state;
    const entitiesTree = this.getEntitiesTree(entities);

    return (
      <div className={b()}>
        <DBTreeView
          entities={entitiesTree}
          selectedNodeId={selectedEntityId}
          onSelect={this.selectEntity}
        />
        <Button onClick={this.loadToCache} disabled={selectedEntityId == null}>Load to cache</Button>
      </div>
    );
  }

  private async loadEntities() {
    const entities = await dataBase.getAllEntities();
    this.setState({ entities });
  }

  private selectEntity(entityId: EntityId) {
    this.setState({ selectedEntityId: entityId });
  }

  @memoize
  private getEntitiesTree(entities: IEntity[]) {
    return buildEntitiesTree(entities);
  }

  private loadToCache() {
    const { entities, selectedEntityId } = this.state;
    const entity = entities.find(e => e.id === selectedEntityId);
    entity && this.props.onLoadToCache(entity);
  }
}
