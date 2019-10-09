import * as React from 'react';
import { block } from 'shared/helpers/bem';

import { Layout } from 'shared/view';

const b = block('data-base-redactor');

class DataBaseRedactor extends React.PureComponent {
  public render() {
    return (
      <Layout>
        <div className={b()}>DataBaseRedactor</div>
      </Layout>
    );
  }
}

export default DataBaseRedactor;
