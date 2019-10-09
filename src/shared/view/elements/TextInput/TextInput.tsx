import Input, { InputProps } from 'antd/lib/input';
import 'antd/lib/input/style/index.less';

import withAntdFormItem from 'shared/helpers/forms/antdFormItem';

export default withAntdFormItem<InputProps>(Input);
