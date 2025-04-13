import { faUsers } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Users: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faUsers} {...props} />;
};

export default Users;
