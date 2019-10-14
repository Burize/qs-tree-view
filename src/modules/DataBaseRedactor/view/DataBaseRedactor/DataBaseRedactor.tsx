import { bindAll } from 'lodash-decorators';
import * as React from 'react';

import { DBView, databaseContract } from 'features/ManageDataBase';
import { CachedView, cacheContract } from 'features/ManageCachedData';
import { ICommunication, initialCommunication, pendingCommunication, makeFailCommunication } from 'shared/helpers/communication';
import { IEntity, EntityId } from 'shared/types/models/entity';
import { block } from 'shared/helpers/bem';
import { Button } from 'shared/view/elements';
import { Layout } from 'shared/view';
import { delay } from 'shared/helpers/delay';

import './DataBaseRedactor.scss';

const b = block('database-redactor');

interface IState {
  applyingToDatabase: ICommunication;
}

@bindAll()
class DataBaseRedactor extends React.PureComponent<{}, IState> {
  public state = { applyingToDatabase: initialCommunication };

  public render() {
    return (
      <Layout>
        <div className={b()}>
          <div className={b('reset')}>
            <Button type="primary" onClick={this.resetRedactor}>Reset</Button>
          </div>
          <div className={b('content')}>
            <div className={b('column')}>
              <CachedView
                onApplyChangesToDatabase={this.applyChangesToDatabase}
                applyingChangesToDatabase={this.state.applyingToDatabase}
              />
            </div>
            <div className={b('column')}>
              <DBView onLoadToCache={this.setEntityToCache} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  private setEntityToCache(entity: IEntity) {
    cacheContract.addToCache(entity);
  }

  private async applyChangesToDatabase(entities: IEntity[], allEntitiesIds: EntityId[]) {
    this.setState({ applyingToDatabase: pendingCommunication });
    try {
      await delay(1500);
      const modifiedEntities = databaseContract.applyToDataBase(entities, allEntitiesIds);
      cacheContract.updateCache(modifiedEntities);
      this.setState({ applyingToDatabase: initialCommunication });
    } catch (e) {
      this.setState({ applyingToDatabase: makeFailCommunication(e.toString()) });
    }
  }

  private resetRedactor() {
    cacheContract.reset();
    databaseContract.reset();
  }
}

export default DataBaseRedactor;
