"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const pathname = usePathname();
  const isPorteMonnaiePage =
    pathname === "/les-ateliers/le-porte-monnaie-des-aventuriers";

  return (
    <div className={`menu${isPorteMonnaiePage ? " menu--porte-monnaie" : ""}`}>
      <div className="menu__inner">
        <Link href="/" aria-label="Retour à l’accueil">
          <Logo
            className="logo-instance"
            img="vector-7.svg"
            state="logo-jaune"
            vector="vector-8.svg"
            vector1="vector-9.svg"
            vector2="vector-10.svg"
            vector3="vector-11.svg"
            vector4="vector-12.svg"
            vector5="vector-13.svg"
          />
        </Link>
        <nav className="menu__links" aria-label="Navigation principale">
          <a className="menu__link" href="#ateliers">
            <span>Ateliers du moment</span>
            <svg
              className="menu__chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <a className="menu__link" href="/ateliers">
            <span>Offres</span>
            <svg
              className="menu__chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <a className="menu__link" href="/contact">
            Contact
          </a>
        </nav>
        <div className="buttons-general">
          <a className="button" href="/reservation">
            <div className="secondary">Réserver</div>
          </a>
        </div>
        <button
          type="button"
          className="menu__toggle"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="menu-mobile-panel"
          onClick={toggleMenu}
        >
          <span className="menu__toggle-line" />
          <span className="menu__toggle-line" />
          <span className="menu__toggle-line" />
        </button>
      </div>
      <div
        id="menu-mobile-panel"
        className={`menu__mobile${isOpen ? " is-open" : ""}`}
      >
        <nav className="menu__mobile-links" aria-label="Navigation mobile">
          <a className="menu__link" href="#ateliers" onClick={closeMenu}>
            <span>Ateliers du moment</span>
            <svg
              className="menu__chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <a className="menu__link" href="/ateliers" onClick={closeMenu}>
            <span>Offres</span>
            <svg
              className="menu__chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <a className="menu__link" href="/contact" onClick={closeMenu}>
            Contact
          </a>
        </nav>
        <div className="buttons-general" onClick={closeMenu}>
          <a className="button" href="/reservation">
            <div className="secondary">Réserver</div>
          </a>
        </div>
      </div>
    </div>
  );
};
