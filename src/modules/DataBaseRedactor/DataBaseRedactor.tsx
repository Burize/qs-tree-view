import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { IModule } from 'shared/types/app';
import { routes } from 'modules/routes';

import { DataBaseRedactor } from './view';

const DataBaseRedactorModule: IModule = {
  getRoutes() {
    return (
      <Route key="DataBaseRedactor" path={routes.redactor}>
        <Switch>
          <Route path={routes.redactor} component={DataBaseRedactor} />
          <Redirect to={routes.redactor} />
        </Switch>
      </Route>
    );
  },
};

export default DataBaseRedactorModule;
