import { ReactElement } from 'react';
import { RouteProps } from 'react-router';

export interface IModule {
  getRoutes(): ReactElement<RouteProps> | Array<ReactElement<RouteProps>>;
}
