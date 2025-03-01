import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Save: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faFloppyDisk} {...props} />;
};

export default Save;
