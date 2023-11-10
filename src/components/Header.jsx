import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import headerLogo from "../images/logo-header.svg";

function Header({ email, onSignOut }) {
  return (
    <header className="header">
      <img src={headerLogo} alt="Место" className="header__logo" />
      <div className="header__about">
        <Routes>
          <Route
            path="/signin"
            element={
              <Link
                to="/signup"
                className="header__nav header__nav_type_hover header__nav_type_cursor"
              >
                Регистрация
              </Link>
            }
          />
          <Route
            path="/signup"
            element={
              <Link
                to="/signin"
                className="header__nav header__nav_type_hover header__nav_type_cursor"
              >
                Войти
              </Link>
            }
          />
          <Route
            path="/"
            element={
              <>
                <p className="header__nav">{email}</p>
                <Link
                  to="/signin"
                  onClick={onSignOut}
                  className="header__nav header__nav_type_hover header__nav_type_cursor"
                >
                  Выйти
                </Link>
              </>
            }
          />
        </Routes>
      </div>
    </header>
  );
}

export default Header;
