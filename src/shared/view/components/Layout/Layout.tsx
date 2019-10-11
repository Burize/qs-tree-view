import * as React from 'react';
import ALayout from 'antd/lib/layout';

import { block } from 'shared/helpers/bem';

import 'antd/lib/layout/style/index.less';
import './Layout.scss';

const { Header, Content } = ALayout;

const b = block('layout');

class Layout extends React.Component {
  public render() {
    const { children } = this.props;
    return (
      <ALayout className={b()}>
        <Header />
        <Content className={b('content')}>{children}</Content>
      </ALayout>
    );
  }
}

export default Layout;
