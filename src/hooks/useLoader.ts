import { useCallback } from "react";
import { createStateProvider } from "react-declarative";

const [LoaderProvider, useLoaderInternal] = createStateProvider<number>();

export const useLoader = () => {
    const [loading, setLoadingInternal] = useLoaderInternal();
    const setLoading = useCallback((loading: boolean) => setLoadingInternal((prevLoading) => prevLoading + (loading ? 1 : -1)), []);
    return [!!loading, setLoading];
}

export { LoaderProvider };

export default useLoader;
