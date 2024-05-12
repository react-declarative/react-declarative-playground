import { Box } from "@mui/material";
import { useMemo } from "react";
import { useElementSize } from "react-declarative";
import { CC_HEADER_HEIGHT } from "../config/params";

interface IEditorWrapperProps {
    onRef: (ref: HTMLIFrameElement) => void;
}

export const EditorWrapper = ({
    onRef,
}: IEditorWrapperProps) => {    
    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const monacoUrl = useMemo(() => {
        const url = new URL(location.href, location.origin);
        url.searchParams.set('monaco', "1");
        return url.toString();
    }, []);

    return (
        <Box ref={elementRef} sx={{ position: "relative" }}>
            <Box
                ref={onRef}
                component="iframe"
                frameBorder="0"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: size.height,
                    width: size.width
                }}
                src={monacoUrl}
            />
        </Box>
    );
};

export default EditorWrapper;
