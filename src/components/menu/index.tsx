import { Logo } from "./Logo";

export const Menu = () => {
  return (
    <div className="menu">
      <div className="menu__inner">
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
      </div>
    </div>
  );
};
