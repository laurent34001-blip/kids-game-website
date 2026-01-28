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
        <div className="buttons-general">
          <button className="button">
            <div className="secondary">Réserver</div>
          </button>
        </div>
      </div>
    </div>
  );
};
