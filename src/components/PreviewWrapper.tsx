import { Box } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useElementSize } from "react-declarative";
import { CC_HEADER_HEIGHT } from "../config/params";

interface IPreviewWrapperProps {
    onRef: (ref: HTMLIFrameElement) => void;
}

export const PreviewWrapper = ({
    onRef,
}: IPreviewWrapperProps) => {    
    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const previewUrl = useMemo(() => {
        const url = new URL(location.href, location.origin);
        url.searchParams.set('preview', "1");
        return url.toString();
    }, []);

    return (
        <Box ref={elementRef}>
            <Box
                ref={onRef}
                component="iframe"
                frameBorder="0"
                sx={{
                    height: `calc(100vh - ${CC_HEADER_HEIGHT}px)`,
                    width: size.width
                }}
                src={previewUrl}
            />
        </Box>
    );
};

export default PreviewWrapper;
