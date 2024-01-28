import React from 'react'

import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export const AuthModal = (props) => {

    const [login, setLogin] = React.useState(true);

    if (!props.show) {
        return null;
    }

    if (login) {
        return (
            <LoginModal setShow={props.setShow} setLogin={setLogin} />
        )
    } else {
        return (
            <RegisterModal setShow={props.setShow} setLogin={setLogin} />
        )
    }
}
