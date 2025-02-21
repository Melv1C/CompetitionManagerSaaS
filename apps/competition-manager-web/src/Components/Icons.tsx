
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faEdit, faFilter, faFloppyDisk, faPlus, faSearch, faTrash, faUsers, IconDefinition } from '@fortawesome/free-solid-svg-icons'


type IconProps = Omit<FontAwesomeIconProps, 'icon'>

type BaseIconProps = IconProps & {
    icon: IconDefinition
}

export const BaseIcon: React.FC<BaseIconProps> = ({ icon, ...props }) => {
    return (
        <FontAwesomeIcon icon={icon} {...props} />
    )
}

export const Add: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faPlus} {...props} />
    )
}

export const Edit: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faEdit} {...props} />
    )
}

export const Delete: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faTrash} {...props} />
    )
}

export const Save: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faFloppyDisk} {...props} />
    )
}

export const Users: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faUsers} {...props} />
    )
}

export const Filter: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faFilter} {...props} />
    )
}

export const Search: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faSearch} {...props} />
    )
}

export const Refresh: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon icon={faArrowsRotate} {...props} />
    )
}


