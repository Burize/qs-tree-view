import * as React from 'react';
import { block } from 'shared/helpers/bem';

import { DBView } from 'features/ManageDataBase';
import { CachedView, cacheContract } from 'features/ManageCachedData';
import { Layout } from 'shared/view';

import './DataBaseRedactor.scss';
import { IEntity } from 'shared/types/models/entity';

const b = block('data-base-redactor');

class DataBaseRedactor extends React.PureComponent {
  public render() {
    return (
      <Layout>
        <div className={b()}>
          <div className={b('section')}>
            <CachedView />
          </div>
          <div className={b('section')}>
            <DBView onLoadToCache={this.setEntityToCache} />
          </div>

        </div>
      </Layout>
    );
  }

  private setEntityToCache(entity: IEntity) {
    cacheContract.addToCache(entity);
  }
}

export default DataBaseRedactor;
