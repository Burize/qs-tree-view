import Slider, { SliderProps } from 'antd/lib/Slider';
import 'antd/lib/Slider/style/index.less';

import withAntdFormItem from 'shared/helpers/forms/antdFormItem';

export { SliderProps };
export default withAntdFormItem<SliderProps>(Slider);
