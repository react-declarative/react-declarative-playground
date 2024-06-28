import { useMemo, useState } from "react";
import { useElementSize } from "react-declarative";

import { makeStyles } from '../styles';

import Box from "@mui/material/Box";
import { Fab } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import useStateContext from "../context/useStateContext";

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
    hidden: {
        visibility: 'hidden',
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

interface IEditorWrapperProps {
    onRef: (ref: HTMLIFrameElement) => void;
    onFullscreenToggle: (fullScreen: boolean) => void;
}

export const EditorWrapper = ({
    onRef,
    onFullscreenToggle,
}: IEditorWrapperProps) => {

    const { classes, cx } = useStyles();

    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const [state] = useStateContext();

    const fullScreen = useMemo(() => {
        if (state.side === "editor") {
            return state.fullScreen;
        }
        return false;
    }, [state]);

    const hidden = useMemo(() => {
        if (state.side !== "editor") {
            return state.fullScreen;
        }
        return false;
    }, [state]);

    const monacoUrl = useMemo(() => {
        const url = new URL(location.href, location.origin);
        url.searchParams.set('monaco', "1");
        return url.toString();
    }, []);

    return (
        <div className={classes.root}>
            <div 
                className={cx(classes.root, {
                    [classes.fullScreen]: fullScreen,
                    [classes.hidden]: hidden,
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
                        src={monacoUrl}
                    />
                    <Fab className={classes.fab} size="small" color="primary" onClick={(e) => {
                        e.stopPropagation();
                        onFullscreenToggle(!fullScreen);
                    }}>
                        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
                    </Fab>
                </div>
            </div>
        </div>
    );
};

export default EditorWrapper;
