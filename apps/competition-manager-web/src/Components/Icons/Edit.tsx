import { faEdit } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Edit: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faEdit} {...props} />;
};

export default Edit;
