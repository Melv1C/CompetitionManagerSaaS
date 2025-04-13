import { faTrash } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Delete: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faTrash} {...props} />;
};

export default Delete;
