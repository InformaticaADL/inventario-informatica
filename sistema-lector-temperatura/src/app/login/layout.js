import React from "react";
import "../globals.css";

const LoginLayout = ({ children }) => {
  return (
    <div
      className="
        min-h-screen 
        flex items-center justify-center 
        h-14 
        bg-cover bg-center bg-fixed relative 
        bg-[url('/images/bg_mob.png')] 
        md:bg-[url('/images/bg_desktop2.png')]
      "
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LoginLayout;
