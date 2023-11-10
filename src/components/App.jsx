// Импорт Реакта, Роутов и Навигаций

import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

// Импорт компонентов

import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import ImagePopup from "./ImagePopup.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import EditProfilePopup from "./EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup.jsx";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import ProtectedRouteElement from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip.jsx";

// Импорт запросов на сервер

import * as auth from "../utils/Auth.js";
import Api from "../utils/Api.js";

// Импорт стилей и картинок

import "../pages/index.css";
import resolve from "../images/Union-success.svg";
import reject from "../images/Union-fail.svg";

const App = () => {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [infoToolTipImage, setInfoToolTipImage] = React.useState("");
  const [infoToolTipTitle, setInfoToolTipTitle] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);

  const navigate = useNavigate();

  // Реакт эффекты

  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([Api.getInitialCards(), Api.getUserInfo()])
        .then(([items, user]) => {
          setCards(items);
          setCurrentUser(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  // Проверка на наличие токена, чтобы перенаправлять пользователя на главную страницу

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((data) => {
          if (data) {
            setLoggedIn(true);
            setEmail(data.data.email);
            navigate("/main", { replace: true });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Функция выхода из учетной записи

  const signOut = () => {
    localStorage.removeItem("jwt");
    navigate("/signin", { replace: true });
    setEmail("");
    setLoggedIn(false);
  };

  // Функции запроса на Авторизацию и Регистрацию

  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        setInfoToolTipImage(resolve);
        setInfoToolTipTitle("Вы успешно зарегистрировались!");
        navigate("/signin", { replace: true });
      })
      .catch(() => {
        setInfoToolTipImage(reject);
        setInfoToolTipTitle("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(handleInfoToolTipOpen);
  };

  const handleLogin = (email, password) => {
    auth
      .authorize(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setEmail(email);
        setLoggedIn(true);
        navigate("/main", { replace: true });
      })
      .catch(() => {
        setInfoToolTipImage(reject);
        setInfoToolTipTitle("Что-то пошло не так! Попробуйте ещё раз.");
        handleInfoToolTipOpen();
      });
  };

  // Функции постановки лайков и удаления карточки

  function handleCardDelete(cardId) {
    Api.deleteCard(cardId)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== cardId));
      })
      .catch((res) => {
        console.log(res);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    Api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Функции открытия попапов

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  const handleInfoToolTipOpen = () => {
    setIsInfoToolTipOpen(!isInfoToolTipOpen);
  };

  // Функция закрытия всех попапов

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(!selectedCard);
  };

  // Функции обновления данных пользователя

  const handleUpdateUser = (userInfo) => {
    Api.setUserInfo(userInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateAvatar = (avatarInfo) => {
    Api.setAvatar(avatarInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Функция запроса создания карточки

  const handleAddPlaceSubmit = (info) => {
    Api.createCard(info)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header onSignOut={signOut} email={email} />
        <Routes>
          <Route
            path="/*"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Register onSubmit={handleRegister} />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <Login onLogin={handleLogin} />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <ProtectedRouteElement
                  element={Main}
                  loggedIn={loggedIn}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
              </>
            }
          />
        </Routes>

        {loggedIn && <Footer />}
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          img={infoToolTipImage}
          title={infoToolTipTitle}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleAddPlaceSubmit}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
