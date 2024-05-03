import { Box } from "@mui/material";
import { useMemo } from "react";
import { useElementSize } from "react-declarative";

export const EditorWrapper = () => {    
    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const monacoUrl = useMemo(() => {
        const url = new URL(location.href, location.origin);
        url.searchParams.set('monaco', "1");
        return url.toString();
    }, []);

    return (
        <Box ref={elementRef}>
            <Box
                component="iframe"
                sx={{
                    height: '100vh',
                    width: size.width
                }}
                src={monacoUrl}
            />
        </Box>
    );
};

export default EditorWrapper;
