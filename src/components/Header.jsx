import React from "react";

function Header() {
  return (
    <header className="flex justify-center items-center bg-green-50 px-4 mb-6 h-[300px]">
      <div className="md:w-1/2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold pt-10 pb-4">Elevate Programming Mastery</h1>
        <p className="text-lg text-gray-500">
          Embark on a journey through the digital realm with our blog, where
          programming becomes an art and technology transforms into magic.
        </p>
      </div>
    </header>
  );
}

export default Header;
