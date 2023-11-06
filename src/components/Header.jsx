import React from "react";
import { Link } from "react-router-dom";
import headerLogo from "../images/logo-header.svg";

function Header({ email, onSignOut, route, title }) {
  return (
    <header className="header">
      <img src={headerLogo} alt="Место" className="header__logo" />
      <div className="header__about">
        <p className="header__nav">{email}</p>
        <Link
          to={route}
          onClick={onSignOut}
          className="header__nav header__nav_type_hover header__nav_type_cursor"
        >
          {title}
        </Link>
      </div>
    </header>
  );
}

export default Header;
