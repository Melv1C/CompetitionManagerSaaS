import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export type IconProps = Omit<FontAwesomeIconProps, 'icon'>;

export type BaseIconProps = IconProps & {
    icon: IconDefinition;
};

const BaseIcon: React.FC<BaseIconProps> = ({ icon, ...props }) => {
    return <FontAwesomeIcon icon={icon} {...props} />;
};

export default BaseIcon;
