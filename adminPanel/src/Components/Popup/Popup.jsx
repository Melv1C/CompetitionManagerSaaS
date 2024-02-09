import React from 'react';
import './Popup.css';

export const Popup = ({ children, onClose }) => {
  return (
    <div className='overlay'>
      <div className='modalPopup'>
        {children}
        <button className='closeButton' onClick={onClose}>x</button>
      </div>
    </div>
  );
}