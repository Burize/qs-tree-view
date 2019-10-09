import Input, { TextAreaProps } from 'antd/lib/input';
import 'antd/lib/input/style/index.less';

import withAntdFormItem from 'shared/helpers/forms/antdFormItem';

export default withAntdFormItem<TextAreaProps>(Input.TextArea);
