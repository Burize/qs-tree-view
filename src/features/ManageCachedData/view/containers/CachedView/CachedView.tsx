import * as React from 'react';
import { BindAll, memoize } from 'lodash-decorators';

import { block } from 'shared/helpers/bem';

import { CachedTreeView } from '../../components';
import { EntityId, IEntity } from 'shared/types/models/entity';
import buildEntitiesTree from 'shared/helpers/buildEntitiesTree';
import { cacheStorage } from 'features/ManageCachedData/state';

interface IState {
  entities: IEntity[];
  selectedEntityId: EntityId | null;
}

const b = block('cached-view');

@BindAll()
export class CachedView extends React.PureComponent<{}, IState> {
  public state: IState = { entities: [], selectedEntityId: null };
  private unsubscribeFromCache?: () => void;

  public componentDidMount() {
    this.getEntities();
    this.unsubscribeFromCache = cacheStorage.onCacheChange(this.getEntities);
  }

  public componentWillUnmount() {
    this.unsubscribeFromCache && this.unsubscribeFromCache();
  }

  public render() {
    const { entities, selectedEntityId } = this.state;
    const entitiesTree = this.getEntitiesTree(entities);

    return (
      <div className={b()}>
        <CachedTreeView
          entities={entitiesTree}
          selectedNodeId={selectedEntityId}
          onSelect={this.selectEntity}
        />
      </div>
    );
  }

  private getEntities() {
    const entities = cacheStorage.getEntities();
    this.setState({ entities });
  }

  @memoize
  private getEntitiesTree(entities: IEntity[]) {
    return buildEntitiesTree(entities);
  }

  private selectEntity(entityId: EntityId) {
    this.setState({ selectedEntityId: entityId });
  }
}
