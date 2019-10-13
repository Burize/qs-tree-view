import * as React from 'react';

import { block } from 'shared/helpers/bem';
import { Button } from 'shared/view/elements';

import './Toolbar.scss';

interface IProps {
  disableEdit: boolean;
  onAdd(): void;
  onDelete(): void;
  onEdit(): void;
  onApplyToDatabase(): void;
}

const b = block('toolbar');

export const Toolbar = React.memo((props: IProps) => {
  const { disableEdit, onAdd, onDelete, onEdit, onApplyToDatabase } = props;
  return (
    <div className={b()}>
      <Button className={b('button')} type="primary" onClick={onAdd} disabled={disableEdit}>Add</Button>
      <Button className={b('button')} type="primary" onClick={onDelete} disabled={disableEdit}>Delete</Button>
      <Button className={b('button')} type="primary" onClick={onEdit} disabled={disableEdit}>Alter</Button>
      <Button className={b('button')} type="primary" onClick={onApplyToDatabase}>Apply</Button>
    </div>
  );
});
