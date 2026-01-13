"use client";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { IoIosArrowDown } from "react-icons/io";
import "../globals.css";
import useIsMobile from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

const IncubadoraLayout = ({ children }) => {
  const isMobile = useIsMobile();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [seccion, setSeccion] = useState("");
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [empresaActual, setEmpresaActual] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ⬇️ LÓGICA DE SEGURIDAD: VERIFICACIÓN DE TOKEN Y SECCIÓN
    const token = Cookies.get("token");

    if (!token) {
      // Redirigir si no hay token (sesión no iniciada)
      router.push("/");
      return;
    }

    try {
      // Decodificar el token para leer la sección
      const decodedUser = jwtDecode(token);
      const userSection = decodedUser.seccion;

      // --- CAMBIO AQUÍ: Validamos que sea INF ---
      if (userSection !== 'INF') {
        console.warn(`Acceso denegado: Usuario ${userSection} intentó acceder a Incubadora.`);
        router.push("/");
        return;
      }

      // ⬆️ FIN LÓGICA DE SEGURIDAD

      const obtenerDatoDeCookies = () => {
        const nombreUsuario = Cookies.get("usuario");
        setNombreUsuario(nombreUsuario || "");

        const seccionCookie = Cookies.get("seccion");
        setSeccion(seccionCookie);
      };
      obtenerDatoDeCookies();
      setLoading(false);

    } catch (error) {
      console.error("Token inválido o expirado en Layout Incubadora:", error);
      router.push("/");
      return;
    }


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [router]);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMostrarMenu(false);
    }
  };

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const cerrarSesion = () => {
    Cookies.remove("usuario");
    Cookies.remove("seccion");
    Cookies.remove("token");
    Cookies.remove("empresa");
    Cookies.remove("id");
    Cookies.remove("userEmail");
    window.location.href = "/";
  };

  const handleLogoClick = () => {
    router.push("/incubadora");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`bg-gray-200 text-white ${isMobile ? "p-4" : "p-8"
          } relative`}
      >
        <div
          onClick={handleLogoClick}
          className="cursor-pointer"
        >
          <img
            src="/images/logo_adl.png"
            alt="Logo"
            className={`${isMobile ? "w-[75px] mt-1" : "w-[120px]"} absolute`}
          />
        </div>
        <div
          className={` ${isMobile ? "text-xs" : "text-xl"
            } font-semibold text-center text-sky-900`}
        >
          <div className="flex flex-col">
            <h1 className="">Sistema Incubadora</h1> {/* Solo cambié el título para que tenga sentido */}
            {isMobile && <p>{seccion || "-"}</p>}
          </div>
        </div>
        <div
          className={`absolute right-5 z-10 -translate-y-1/2 transform ${isMobile ? "top-6" : "top-12"
            }`}
          ref={menuRef}
        >
          {isMobile ? (
            <button
              onClick={toggleMenu}
              className="flex items-center bg-transparent text-sky-900 cursor-pointer focus:outline-none hover:bg-gray-300 mt-3 py-2 rounded-full "
            >
              <div className="flex space-x-2 items-center">
                <div className="flex ">
                  <img
                    src={"/images/empresas/ADL.png"}
                    alt="Logo Empresa"
                    className={`${isMobile ? "w-[40px] h-[40px]" : "w-[50px]"
                      } rounded-full border-2 border-sky-500 p-1 relative`}
                  />
                </div>
                <div className={`flex items-center`}>
                  <IoIosArrowDown className="w-5 h-5" />
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={toggleMenu}
              className="flex flex-col items-center bg-transparent text-sky-900 cursor-pointer focus:outline-none hover:bg-gray-300 px-3 py-2 rounded-full"
            >
              <div className="flex">
                <div className="flex space-x-2">
                  <img
                    src={"/images/empresas/ADL.png"}
                    alt="Logo Empresa"
                    className={`${isMobile ? "hidden" : "w-[50px]"
                      } rounded-full border-2 border-sky-500 p-1 relative`}
                  />
                </div>
                <div>
                  <div className="flex items-center px-3 space-x-3">
                    <p className={`${isMobile ? "hidden" : ""}`}>
                      {nombreUsuario}
                    </p>
                  </div>
                  <p
                    className={`${isMobile ? "hidden" : ""
                      } text-sm text-left px-3`}
                  >
                    {seccion || "-"}
                  </p>
                </div>
                <div className={`flex items-center ${isMobile ? "mt-7" : ""}`}>
                  <IoIosArrowDown className="w-5 h-5" />
                </div>
              </div>
            </button>
          )}
          {mostrarMenu && (
            <div className="absolute top-14 right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
              <button
                onClick={cerrarSesion}
                className="block w-full text-left px-4 py-2 text-sky-900 hover:bg-gray-100 focus:outline-none"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex-1">{children}</main>
      </div>
      <footer className="bg-gray-200 text-sky-900 p-6 text-center">
        <div
          className={`container mx-auto text-sm ${isMobile ? "text-sm" : ""}`}
        >
          <p>&copy; ADL Diagnostic Chile SpA 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default IncubadoraLayout;