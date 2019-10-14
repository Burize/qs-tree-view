import * as React from 'react';
import { BindAll, memoize } from 'lodash-decorators';

import { block } from 'shared/helpers/bem';
import buildEntitiesTree from 'shared/helpers/buildEntitiesTree';
import { EntityId, IEntity } from 'shared/types/models/entity';
import { ICommunication, isSuccessCommunication, isFailedCommunication } from 'shared/helpers/communication';
import { message } from 'shared/view/elements';

import { cacheStorage } from './../../../state';
import { CachedTreeView, Toolbar, AddModal, AlterModal, ApplyingChangesLoader } from '../../components';

import './CachedView.scss';

interface IProps {
  applyingChangesToDatabase: ICommunication;
  onApplyChangesToDatabase(entities: IEntity[], allEntitiesIds: EntityId[]): void;
}

interface IState {
  entities: IEntity[];
  selectedEntityId: EntityId | null;
  isOpenAddModal: boolean;
  isOpenAlterModal: boolean;
}

const b = block('cached-view');

@BindAll()
export class CachedView extends React.PureComponent<IProps, IState> {
  public state: IState = {
    entities: [],
    selectedEntityId: null,
    isOpenAddModal: false,
    isOpenAlterModal: false,
  };
  private unsubscribeFromCacheChanges?: () => void;

  public componentDidMount() {
    this.getEntities();
    this.unsubscribeFromCacheChanges = cacheStorage.onCacheChange(this.getEntities);
  }

  public componentDidUpdate(prevProps: IProps) {
    const { applyingChangesToDatabase } = this.props;

    if (isSuccessCommunication(prevProps.applyingChangesToDatabase, applyingChangesToDatabase)) {
      cacheStorage.onCacheApplied();
    }

    if (isFailedCommunication(prevProps.applyingChangesToDatabase, applyingChangesToDatabase)) {
      this.onApplyingCacheError();
    }
  }

  public componentWillUnmount() {
    this.unsubscribeFromCacheChanges && this.unsubscribeFromCacheChanges();
  }

  public render() {
    const { applyingChangesToDatabase } = this.props;
    const { entities, selectedEntityId, isOpenAddModal, isOpenAlterModal } = this.state;
    const entitiesTree = this.getEntitiesTree(entities);

    const selectedEntity = this.state.entities.find(e => e.id === selectedEntityId);

    const isEnabledEditEntity = !!selectedEntity && !selectedEntity.isRemoved;

    return (
      <div className={b()}>
        <div className={b('tree')}>
          <CachedTreeView
            entities={entitiesTree}
            selectedNodeId={selectedEntityId}
            onSelect={this.selectEntity}
          />
        </div>
        {!applyingChangesToDatabase.isRequesting && (
          <Toolbar
            onAdd={this.showAddModal}
            onEdit={this.showAlterModal}
            onDelete={this.deleteEntity}
            onApplyToDatabase={this.applyToDatabase}
            disableEdit={!isEnabledEditEntity}
          />
        )}
        {applyingChangesToDatabase.isRequesting && <ApplyingChangesLoader />}
        <AddModal
          isOpen={isOpenAddModal}
          onAccept={this.createEntity}
          onCancel={this.closeAddModal}
        />
        <AlterModal
          currentValue={selectedEntity ? selectedEntity.value : ''}
          isOpen={isOpenAlterModal}
          onAccepts={this.alterEntity}
          onCancel={this.closeAlterModal}
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

  private selectEntity(entityId: EntityId | null) {
    this.setState({ selectedEntityId: entityId });
  }

  private showAlterModal() {
    this.setState({ isOpenAlterModal: true });
  }

  private closeAlterModal() {
    this.setState({ isOpenAlterModal: false });
  }

  private alterEntity(value: string) {
    const { selectedEntityId } = this.state;
    this.closeAlterModal();
    selectedEntityId && cacheStorage.updateEntity(selectedEntityId, value);
  }

  private deleteEntity() {
    const { selectedEntityId } = this.state;
    selectedEntityId && cacheStorage.deleteEntity(selectedEntityId);
  }

  private showAddModal() {
    this.setState({ isOpenAddModal: true });
  }

  private closeAddModal() {
    this.setState({ isOpenAddModal: false });
  }

  private createEntity(value: string) {
    const { selectedEntityId } = this.state;
    this.closeAddModal();
    selectedEntityId && cacheStorage.createEntity(value, selectedEntityId);
  }

  private applyToDatabase() {
    const modifiedEntities = cacheStorage.getModifiedEntities();
    const allEntitiesIds: EntityId[] = cacheStorage.getEntities().map(e => e.id);
    this.props.onApplyChangesToDatabase(modifiedEntities, allEntitiesIds);
  }

  private onApplyingCacheError() {
    message.error('Cache is temporarily unavailable. Try again in a few minutes.');
  }
}
