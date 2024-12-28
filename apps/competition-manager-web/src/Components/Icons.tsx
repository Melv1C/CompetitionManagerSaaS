
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

type IconProps = Omit<FontAwesomeIconProps, 'icon'>

export const Add: React.FC<IconProps> = (props) => {
    return (
      <FontAwesomeIcon icon={faPlus} {...props} />
    )
}

export const Edit: React.FC<IconProps> = (props) => {
    return (
      <FontAwesomeIcon icon={faEdit} {...props} />
    )
}

export const Delete: React.FC<IconProps> = (props) => {
    return (
      <FontAwesomeIcon icon={faTrash} {...props} />
    )
}


