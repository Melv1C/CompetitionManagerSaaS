import { faFilter } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Filter: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faFilter} {...props} />;
};

export default Filter;
