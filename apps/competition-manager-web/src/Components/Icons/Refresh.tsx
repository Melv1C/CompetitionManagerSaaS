import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Refresh: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faArrowsRotate} {...props} />;
};

export default Refresh;
