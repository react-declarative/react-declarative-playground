import { useMemo, useState } from "react";
import { useElementSize } from "react-declarative";

import { makeStyles } from '../styles';

import Box from "@mui/material/Box";
import { Fab } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";

const useStyles = makeStyles()((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
    },
    fullScreen: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100dvh",
        width: "100dvw",
        zIndex: 999,
    },
    container: {
        flex: 1,
        position: "relative",
    },
    content: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    fab: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        opacity: 0.33,
        transition: 'opacity 500ms',
        '&:hover': {
            opacity: 1,
        }
    },
}));

interface IPreviewWrapperProps {
    onRef: (ref: HTMLIFrameElement) => void;
}

export const PreviewWrapper = ({
    onRef,
}: IPreviewWrapperProps) => { 
    
    const { classes, cx } = useStyles();

    const [fullScreen, setFullScreen] = useState(false);
    
    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const previewUrl = useMemo(() => {
        const url = new URL(location.href, location.origin);
        url.searchParams.set('preview', "1");
        return url.toString();
    }, []);

    return (
        <div className={classes.root}>
            <div 
                className={cx(classes.root, {
                    [classes.fullScreen]: fullScreen,
                })}
            >
                <div ref={elementRef} className={classes.container}>
                    <Box
                        className={classes.content}
                        ref={onRef}
                        component="iframe"
                        frameBorder="0"
                        sx={{
                            height: size.height,
                            width: size.width
                        }}
                        src={previewUrl}
                    />
                    <Fab className={classes.fab} size="small" color="primary" onClick={() => setFullScreen(f => !f)}>
                        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
                    </Fab>
                </div>
            </div>
        </div>
    );
};

export default PreviewWrapper;
