import Checkbox, { CheckboxProps } from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/index.less';

import withAntdFormItem from 'shared/helpers/forms/antdFormItem';

export { CheckboxProps };
export default withAntdFormItem<CheckboxProps>(Checkbox);
