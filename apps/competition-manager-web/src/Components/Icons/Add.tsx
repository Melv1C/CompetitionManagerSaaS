import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Add: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faPlus} {...props} />;
};

export default Add;
