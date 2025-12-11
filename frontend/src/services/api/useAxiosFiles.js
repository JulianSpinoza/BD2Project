import { useEffect } from "react";

export function useAxiosFiles(axiosInstance){
    useEffect(() => {
        const requestId = axiosInstance.interceptors.request.use(
            config => {
                config.headers['Content-Type'] = "multipart/form-data";
                return config;
            },
            (err) => Promise.reject(err)
        );
        return () => {
            axiosInstance.interceptors.reject.eject(requestId);
        }
    }, [axiosInstance]);

    return axiosInstance;
}