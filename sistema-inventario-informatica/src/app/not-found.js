"use client";
import React from "react";
import { useRouter } from "next/navigation";
import './globals.css';

const NotFoundPage = () => {
  const router = useRouter();

  const goBack = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white opacity-80">
      <div className="bg-white  p-6 text-center">
        <div className="flex justify-center mb-10">
          <img
            src="/images/logo_adl.png"
            alt="Logo ADL"
            className="w-100 object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          Página no encontrada
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <button
          onClick={goBack}
          className="bg-sky-700 hover:bg-sky-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
