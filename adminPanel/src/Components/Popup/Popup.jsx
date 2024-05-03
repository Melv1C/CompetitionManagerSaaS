import React from 'react';
import './Popup.css';

export const Popup = ({ children, onClose, size }) => {
  let className = "modalPopup"
  switch (size) {
    case 'big':
      className += ' biggerPopup';
      break;
    default:
      break;
  }
  return (
    <div className='overlay'>
      <div className={className}>
        {children}
        <button className='closeButton' onClick={onClose}>x</button>
      </div>
    </div>
  );
}