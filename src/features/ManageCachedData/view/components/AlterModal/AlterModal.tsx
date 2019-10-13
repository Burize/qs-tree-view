import * as React from 'react';

import { Button, Modal, TextInput } from 'shared/view/elements';

interface IProps {
  currentValue: string;
  isOpen: boolean;
  onAccepts(value: string): void;
  onCancel(): void;
}

export const AlterModal = React.memo(({ currentValue, isOpen, onAccepts, onCancel }: IProps) => {
  const inputRef = React.useRef<TextInput>(null);
  const [value, setValue] = React.useState('');
  const onChangeValue = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  const onSubmit = React.useCallback(() => {
    onAccepts(value);
  }, [onAccepts, value]);

  React.useEffect(() => {
    isOpen && setValue(currentValue);
  }, [currentValue, isOpen]);

  React.useEffect(() => {
    isOpen && inputRef.current && inputRef.current.input.focus();
  }, [isOpen]);

  const actionButtons = React.useMemo(() =>
    [
      <Button key="cancel" type="primary" onClick={onCancel}>Cancel</Button>,
      <Button key="accept" type="primary" onClick={onSubmit} disabled={!value}>Accept</Button>,
    ],
    [onCancel, onSubmit, !value]);

  return (
    <Modal
      title="Change value"
      visible={isOpen}
      onCancel={onCancel}
      footer={actionButtons}
      forceRender
      centered
    >
      <TextInput
        placeholder="Node value"
        onChange={onChangeValue}
        value={value}
        ref={inputRef}
      />
    </Modal>
  );
});
