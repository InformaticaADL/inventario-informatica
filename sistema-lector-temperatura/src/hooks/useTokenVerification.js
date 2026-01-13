import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/apiConfig";
import Cookies from "js-cookie";

const useTokenVerification = () => {
    const [sessionModalVisible, setSessionModalVisible] = useState(false);
    
    const router = useRouter();

    const verificarToken = async () => {
        const token = Cookies.get("token");
        try {
            await api.get("/usuario/validar-token", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSessionModalVisible(false);
            console.log("Token válido");
        } catch (error) {
            setSessionModalVisible(true);
           
            console.error("Token inválido");
        }
    };

    useEffect(() => {
        // Ejecutar la verificación inmediatamente
        verificarToken();
        // Configurar el intervalo para ejecutar la función cada 5 minutos (300,000 ms)
        const intervalId = setInterval(verificarToken, 300000);
        // Limpiar el intervalo cuando el hook se desmonte
        return () => clearInterval(intervalId);
    }, []);

    const handleSessionModalOk = () => {
        setSessionModalVisible(false);
        router.push("/login");
    };

    return { sessionModalVisible, handleSessionModalOk };
};

export default useTokenVerification;
