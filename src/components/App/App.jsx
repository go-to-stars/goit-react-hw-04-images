import React from 'react';
import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { Searchbar } from '../Searchbar/Searchbar';
import { fetchPictures } from '../services/apiService'; // імпорт функції fetchPictures
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Loader } from '../Loader/Loader';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { Container, ErrorContainer } from './App.styled'; // імпорт стилів тегів div (Container), div (Box), h1 (TopTitle), h2 (Title)

export const App = () => {
  const [query, setQuery] = useState(''); // виклик хука useState створює стан query і метод setQuery, який змінює його значення
  const [pictures, setPictures] = useState([]); // виклик хука useState створює стан pictures і метод setPictures, який змінює його значення
  const [page, setPage] = useState(1); // виклик хука useState створює стан page і метод setPage, який змінює його значення
  const [error, setError] = useState(null); // виклик хука useState створює стан error і метод setError, який змінює його значення
  const [showModalWindow, setShowModalWindow] = useState(false); // виклик хука useState створює стан showModalWindow і метод setShowModalWindow, який змінює його значення
  const [pictureModalWindow, setPictureModalWindow] = useState(''); // виклик хука useState створює стан pictureModalWindow і метод setPictureModalWindow, який змінює його значення
  const [altPicture, setAltPicture] = useState(''); // виклик хука useState створює стан altPicture і метод setAltPicture, який змінює його значення
  const [isLoading, setIsLoading] = useState(false); // виклик хука useState створює стан isLoading і метод setIsLoading, який змінює його значення
  const [responceLenght, setResponceLenght] = useState(0); // виклик хука useState створює стан responceLenght і метод setResponceLenght, який змінює його значення

  useEffect(() => {
    if (query !== '') {
      try {
        setIsLoading(true); // записуємо true в стан isLoading (показати лоадер)
        fetchPictures(query, page)
          .then(respons => {
            const data = respons;
            setPictures(previousState => [...previousState, ...data]); // додаємо в стан pictures до масиву поперередніх картинок масив нових
            setResponceLenght(data.length); // записуємо розмір отриманого масиву (data.length) в стан responceLenght
            setIsLoading(false); // записуємо false в стан isLoading (сховати лоадер)

            if (data.length < 12) {
              Notiflix.Notify.warning(
                'It was the last page. Please try another query.'
              );
            } // при розміру масиву в відповіді менше 12 картинок, виводимо повідомлення, що це остання сторінка
          })
          .catch(error => {
            setError(error); // записуємо помилку error в стан error
            Notiflix.Notify.failure(
              'Oops, sorry, there were problems with the download. Please try again.'
            );
            console.log('Error', error.message);
          }); //передача вмісту запиту query і номера сторінки page в фукцію "fetchPictures" та очікування на відповідь; при правильній відповіді додаємо її в відповідні стани, при помилці виводимо відповідне повідомлення
      } catch (error) {
        setError(error); // записуємо помилку error в стан error
        Notiflix.Notify.failure(
          'Oops, sorry, there were problems with the download. Please try again.'
        );
        console.log('Error', error.message);
      }
    } // якщо поле query пусте, то запит на сервер не робимо
  }, [query, page]); // якщо змінився запит (query) або номер сторінки (page) то виконуємо запит на сервер, при позитивній відповіді додаємо її в стан pictures

  const searchPictures = value => {
    if (value === '') {
      return Notiflix.Notify.failure(
        'Sorry, the search field cannot be empty. Please try again.'
      ); // якщо інпут пустий, то виводимо відповідне повідомлення
    } else if (value !== query) {
      setQuery(value); // стану query присвоюється значення value поля вводу
      setPictures([]); // стану pictures присвоюється значення пустого масиву (обнуляємо вміст малюнків)
      setPage(1); // стану page присвоюється значення 1 (скидаємо лічильник сторінок до 1)
    } // інакше, якщо запит query змінився, то в відповідні стани записуємо текст запиту, обнуляємо вміст малюнків та скидаємо лічильник сторінок до 1
  }; // функція searchPictures класу App додає в стан query запит та обнуляє вміст малюнків (стан pictures) і скидає лічильник сторінок до 1 (стан page)

  const chosesPicture = (large, tags) => {
    setPictureModalWindow(large);
    setAltPicture(tags);
    toggleModalWindow();
  }; // функція chosesPicture класу App додає в state адресу великої картинки largeImageURL (large) та підпис цієї картинки alt (tags)

  const toggleModalWindow = () => {
    setShowModalWindow(!showModalWindow);
  }; // функція toggleModalWindow класу App змінює на протилежний стан мобільного вікна (показувати/не показувати)

  const nextPage = () => {
    setPage(previousState => [previousState + 1]); // стану page присвоюється попереднє значеня + 1 (інкремент на 1)
  }; // функція nextPage класу App додає в стан page поперереднє значення номеру сторінки (page) збільшене на 1

  return (
    <Container>
      <Searchbar onSubmit={searchPictures} />

      {pictures && (
        <ImageGallery
          pictures={pictures}
          onClickSelectPicture={chosesPicture}
        />
      )}

      {error && <ErrorContainer>{error.message}</ErrorContainer>}

      {isLoading && <Loader />}

      {!(responceLenght < 12) && <Button onNextPage={nextPage} />}

      {showModalWindow && (
        <Modal
          largeImg={pictureModalWindow}
          altImg={altPicture}
          onClose={toggleModalWindow}
        />
      )}
    </Container>
  ); // повернення для рендеру розмітки застосунку "Пошук зображень"
}; // клас App(), повертає компоненти з даними для рендеру сторінки застосунку "Пошук зображень"
