import React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ModalBox, LargeImg } from './Modal.styled';

export const Modal = ({ altImg, largeImg, onClose }) => {
  useEffect(() => {
    const keyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    }; // метод keyDown, при настанні події - натискання клавіші 'Escape' викликає функцію onClose() батьківського компоненнта
    window.addEventListener('keydown', keyDown); // додаємо слухач натискання кнопок на клавіатурі
    return () => {
      window.removeEventListener('keydown', keyDown); // прибираємо слухач натискання кнопок на клавіатурі
    };
  }, [onClose]);

  const overlayClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  }; // функція overlayClick, при настанні події - натискання на підкладку модального вікна overlay викликає функцію onClose() батьківського компоненнта

  return (
    <Overlay onClick={overlayClick}>
      <ModalBox>
        <LargeImg src={largeImg} alt={altImg} />
      </ModalBox>
    </Overlay>
  ); // повернення для рендеру розмітки модального вікна, теги Overlay (div), ModalBox (div) та LargeImg (img)
}; // клас Modal, повертає компоненти з даними для рендеру модального вікна

Modal.propTypes = {
  altImg: PropTypes.string.isRequired,
  largeImg: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}; // типізація (опис типів) пропсів компоненту класу Modal
