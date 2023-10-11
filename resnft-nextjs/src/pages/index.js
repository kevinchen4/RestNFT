import React from "react";
import Link from "next/link";

const Index = () => {
  return (
    <div className="Landing-wrapper">
      <div>
        <img src="../Logo.png" alt="logo" className="Landing-logo"/>
      </div>
      <div className="Landing-content">
        <img src="../Plate.png" className="Landing-plate"/>
        <p>Where reservations become collectable</p>
        <button className="Landing-Button">
          <Link href="/login">ENTER</Link>
        </button>
      </div>
    </div>
  );
};

export default Index;