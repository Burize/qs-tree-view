import * as React from 'react';
import ALayout from 'antd/lib/layout';

import { block } from 'shared/helpers/bem';

import 'antd/lib/layout/style/index.less';

const { Header, Footer, Content } = ALayout;

import './Layout.scss';

const b = block('layout');

class Layout extends React.PureComponent {
  public render() {
    const { children } = this.props;
    return (
      <ALayout className={b()}>
        <Header />
        <Content className={b('content').toString()}>{children}</Content>
        <Footer />
      </ALayout>
    );
  }
}

export default Layout;
