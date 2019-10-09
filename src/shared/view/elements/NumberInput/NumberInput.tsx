import Input, { InputNumberProps } from 'antd/lib/input-number';
import 'antd/lib/input-number/style/index.less';

import withAntdFormItem from 'shared/helpers/forms/antdFormItem';

export { InputNumberProps };
export default withAntdFormItem<InputNumberProps>(Input);
