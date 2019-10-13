import * as React from 'react';

import { Spinner } from 'shared/view/elements';
import { block } from 'shared/helpers/bem';

import './ApplyingChangesLoader.scss';

const b = block('apply-changes-loader');

export const ApplyingChangesLoader = React.memo(() => {
  return (
    <div className={b()}>
      <Spinner />
      <div className={b('description')}> Applying changes to database ...</div>
    </div>
  );
});
