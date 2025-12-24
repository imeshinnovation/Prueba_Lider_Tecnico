// src/App.tsx
import React, { useState, useEffect } from 'react';
import api from './api/client';
import UserTable from './components/UserTable';

interface HealthResponse {
    status: string;
}

function App() {
    const [isServiceUp, setIsServiceUp] = useState<boolean | null>(null); // null = cargando, true = up, false = down

    const checkHealth = async () => {
        try {
            await api.get<HealthResponse>('/health');
            setIsServiceUp(true);
        } catch (err) {
            setIsServiceUp(false);
        }
    };

    useEffect(() => {
        checkHealth();

        // Reintenta cada 15 segundos
        const interval = setInterval(checkHealth, 15000);
        return () => clearInterval(interval);
    }, []);

    // Mientras verifica el health por primera vez
    if (isServiceUp === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Verificando estado del servicio...</p>
                </div>
            </div>
        );
    }

    // Si el servicio está en mantenimiento o caído
    if (isServiceUp === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
                <div className="text-center max-w-lg">
                    <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
                        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            En este momento el servicio está en mantenimiento
                        </h1>
                        <p className="text-small text-gray-600">
                            Estamos trabajando para mejorar tu experiencia.<br />Por favor, intenta nuevamente en unos minutos.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Si todo está bien → muestra la gestión de usuarios
    return (
        <div className="min-h-screen bg-gray-50">
            <UserTable />
        </div>
    );
}

export default App;