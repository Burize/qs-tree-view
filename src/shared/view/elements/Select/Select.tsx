import * as React from 'react';
import ASelect, { SelectProps } from 'antd/lib/select';
import 'antd/lib/select/style/index.less';

import withAntdFormItem from 'shared/helpers/forms/antdFormItem';

const Option = ASelect.Option;

interface IOption {
  value: string;
  label: string;
}

interface IOwnProps {
  options: IOption[];
}

type IProps = IOwnProps & SelectProps<any>;

class Select extends React.PureComponent<IProps> {
  public render() {
    const { options, ...rest } = this.props;
    return (
      <ASelect {...rest}>
        {options.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)}
      </ASelect>
    );
  }
}

export default withAntdFormItem<IProps>(Select);
