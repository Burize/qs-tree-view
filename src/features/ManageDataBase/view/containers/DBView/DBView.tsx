import * as React from 'react';
import { BindAll, memoize } from 'lodash-decorators';

import { EntityId, IEntity } from 'shared/types/models/entity';
import { Button } from 'shared/view/elements';
import buildEntitiesTree from 'shared/helpers/buildEntitiesTree';
import { block } from 'shared/helpers/bem';

import { DBTreeView } from '../../components';
import { database } from '../../../state';

import './DBView.scss';

interface IProps {
  onLoadToCache(entity: IEntity, parentsIds: EntityId[]): void;
}

interface IState {
  entities: IEntity[];
  selectedEntityId: EntityId | null;
}

const b = block('db-view');

@BindAll()
export class DBView extends React.PureComponent<IProps, IState> {
  public state: IState = { entities: [], selectedEntityId: null };
  private unsubscribeFromDatabaseUpdates?: () => void;

  public componentDidMount() {
    this.loadEntities();
    this.unsubscribeFromDatabaseUpdates = database.onDatabaseUpdate(this.loadEntities);
  }

  public componentWillUnmount() {
    this.unsubscribeFromDatabaseUpdates && this.unsubscribeFromDatabaseUpdates();
  }

  public render() {
    const { entities, selectedEntityId } = this.state;
    const entitiesTree = this.getEntitiesTree(entities);

    const selectedEntity = entities.find(e => e.id === selectedEntityId);

    const isEnabledLoadEntity = !!selectedEntity && !selectedEntity.isRemoved;

    return (
      <div className={b()}>
        <div className={b('tree')}>
          <DBTreeView
            entities={entitiesTree}
            selectedNodeId={selectedEntityId}
            onSelect={this.selectEntity}
          />
        </div>
        <Button
          type="primary"
          onClick={this.loadToCache}
          disabled={!isEnabledLoadEntity}
        >
          Load to cache
        </Button>
      </div>
    );
  }

  private async loadEntities() {
    const entities = database.getEntities();
    this.setState({ entities });
  }

  private selectEntity(entityId: EntityId | null) {
    this.setState({ selectedEntityId: entityId });
  }

  @memoize
  private getEntitiesTree(entities: IEntity[]) {
    return buildEntitiesTree(entities);
  }

  private loadToCache() {
    const { entities, selectedEntityId } = this.state;
    const entity = entities.find(e => e.id === selectedEntityId);

    if (!entity) {
      throw new Error('Entity with specified id was not exist');
    }

    const parentsIds = database.getEntityAncestors(entity.id);
    this.props.onLoadToCache(entity, parentsIds);
  }
}
