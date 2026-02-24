import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { apiClient } from '../api/client';

export const useApiConfig = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const requestInterceptor = apiClient.interceptors.request.use(
            async (config) => {
                try {
                    const token = await getToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error("Error getting Clerk token:", error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
        };
    }, [getToken]);
};
