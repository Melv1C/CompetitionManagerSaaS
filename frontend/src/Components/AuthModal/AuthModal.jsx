import React from 'react'

import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export const AuthModal = (props) => {

    if (!props.show) {
        return null;
    }

    if (props.login) {
        return (
            <LoginModal setShow={props.setShow} setLogin={props.setLogin} />
        )
    } else {
        return (
            <RegisterModal setShow={props.setShow} setLogin={props.setLogin} />
        )
    }
}
