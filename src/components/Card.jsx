import React from "react";
import heart from "../images/heart.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `card__button-heart ${
    isLiked ? "card__heart_type_active" : ""
  }`;

  const handleClick = () => {
    onCardClick(card);
  };

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card._id);
  };

  return (
    <li className="card">
      {isOwn && (
        <button
          type="button"
          className="card__trash"
          onClick={handleDeleteClick}
        ></button>
      )}
      <img
        onClick={handleClick}
        src={card.link}
        className="card__image"
        alt={card.name}
      />
      <div className="card__caption-heart">
        <h3 className="card__caption">{card.name}</h3>
        <div className="card__heart-likes">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          >
            <img src={heart} alt="сердечко" className="card__heart" />
          </button>
          <span className="card__likes">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
