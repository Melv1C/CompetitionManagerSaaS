import { faSearch } from '@fortawesome/free-solid-svg-icons';
import BaseIcon, { IconProps } from './BaseIcon';

const Search: React.FC<IconProps> = (props) => {
    return <BaseIcon icon={faSearch} {...props} />;
};

export default Search;
