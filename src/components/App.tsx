import { CssBaseline, LinearProgress } from "@mui/material";
import Editor from "./Editor";
import useLoader from "../hooks/useLoader";

import { useEffect, useMemo, useRef } from "react";
import Split from 'react-split-it';
import EditorWrapper from "./EditorWrapper";
import Preview from "./Preview";
import PreviewWrapper from "./PreviewWrapper";
import { useSnack } from "react-declarative";


export const App = () => {
    const [loader] = useLoader();
    const notify = useSnack();

    const iframeRef = useRef<HTMLIFrameElement>(null as never);

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                iframeRef.current?.contentWindow?.postMessage({
                    type: data.type,
                    code: data.code,
                });
            }
            if (data.type === "notify-action" && data.notify) {
                notify(data.notify);
            }
        });
    }, []);

    const isMonacoPage = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('monaco');
    }, []);

    const isPreviewPage = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('preview');
    }, []);

    if (isMonacoPage) {
        return (
            <>          
                <CssBaseline />
                <Editor
                    onChange={(code) => {
                        window.top?.postMessage(
                            {
                                type: "code-action",
                                code,
                            },
                            "*",
                        );
                    }}
                />
            </>
        );
    }

    if (isPreviewPage) {
        return (
            <>
                <CssBaseline />
                <Preview
                    onNotify={(notify) => {
                        window.top?.postMessage(
                            {
                                type: "notify-action",
                                notify,
                            },
                            "*",
                        );
                    }}
                />
            </>
        )
    }

    return (
        <>
            <CssBaseline />
            {loader && (
                <LinearProgress
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                    }}
                />
            )}
             <Split>
                <EditorWrapper />
                <PreviewWrapper onRef={(ref) => {
                    iframeRef.current = ref;
                }} />
            </Split>
        </>
    );
};

export default App;
