import React from "react";

function InfoTooltip({ onClose, isOpen, img, title }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_union">
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
        ></button>
        <img src={img} alt={title} className="popup__image popup__union" />
        <p className="popup__success-text">{title}</p>
      </div>
    </div>
  );
}

export default InfoTooltip;
