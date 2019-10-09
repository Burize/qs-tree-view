import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './core/App';

const render = (Component: () => JSX.Element) =>
  ReactDOM.render(
    <Component />,
    document.getElementById('root'),
  );

render(App);
if ((module as any).hot) {
  (module as any).hot.accept('./core/App', () => render(App));
}
