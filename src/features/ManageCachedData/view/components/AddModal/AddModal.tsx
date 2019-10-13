import * as React from 'react';

import { Button, Modal, TextInput } from 'shared/view/elements';

interface IProps {
  isOpen: boolean;
  onAccept(value: string): void;
  onCancel(): void;
}

export const AddModal = React.memo(({ isOpen, onAccept, onCancel }: IProps) => {
  const inputRef = React.useRef<TextInput>(null);
  const [value, setValue] = React.useState('');
  const onChangeValue = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  const onSubmit = React.useCallback(() => {
    onAccept(value);
  }, [onAccept, value]);

  React.useEffect(() => {
    isOpen && setValue('');
  }, [isOpen]);

  React.useEffect(() => {
    isOpen && inputRef.current && inputRef.current.input.focus();
  }, [isOpen]);

  const actionButtons = React.useMemo(() =>
    [
      <Button key="cancel" type="primary" onClick={onCancel}>Cancel</Button>,
      <Button key="accept" type="primary" onClick={onSubmit} disabled={!value}>Create</Button>,
    ],
    [onCancel, onSubmit, !value]);

  return (
    <Modal
      title="Create new node"
      visible={isOpen}
      onCancel={onCancel}
      footer={actionButtons}
      forceRender
      centered
    >
      <TextInput
        placeholder="New node value"
        onChange={onChangeValue}
        value={value}
        ref={inputRef}
      />
    </Modal>
  );
});
