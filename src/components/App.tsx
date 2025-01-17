import { Box, CssBaseline, LinearProgress } from "@mui/material";
import Editor from "./Editor";
import useLoader from "../hooks/useLoader";

import { useEffect, useMemo, useRef } from "react";
import Split from 'react-split-it';
import EditorWrapper from "./EditorWrapper";
import Preview from "./Preview";
import PreviewWrapper from "./PreviewWrapper";
import { FieldType, useDate, useMediaContext, useOne, useSnack, useTime } from "react-declarative";
import Header from "./Header";

import "./common/Neuron";

import './common/MonthProgressWrapper';
import './common/TimeLossWrapper';

import './common/IndicatorProgressWrapper';
import './common/IndicatorWaitingWrapper';
import './common/IndicatorArchiveWrapper';
import './common/IndicatorDoneWrapper';
import './common/IndicatorAllWrapper';

import './common/IndicatorCard';

import './common/AvatarPicker';
import './common/RemoveAccount';

import "./common/Currency";
import "./common/StockChart";
import useStateContext from "../context/useStateContext";
import SubscribeModal from "./SubscribeModal";
import MantineModal from "./MantineModal";
import CommercialModal from "./CommercialModal";

const isDevelopment = () => {
    return process.env.CC_NODE_ENV === "development";
}

export const App = () => {
    const [loader] = useLoader();
    const notify = useSnack();

    const { isMobile } = useMediaContext();

    const [, setStateContext] = useStateContext();

    const pickOne = useOne({
        title: 'Waiting for user input',
        fields: [
            { type: FieldType.Text, title: 'Firstname', defaultValue: 'Петр', name: 'f' },
            { type: FieldType.Text, title: 'Lastname', name: 'l' },
            { type: FieldType.Text, title: 'Patronymic', name: 'p' },
        ],
    });
    const pickDate = useDate();
    const pickTime = useTime();

    useEffect(() => {
        (window as any).pickOne = pickOne;
        (window as any).pickDate = pickDate;
        (window as any).pickTime = pickTime;
        (window as any).notify = notify;
    }, []);

    const previewRef = useRef<HTMLIFrameElement>(null as never);
    const editorRef = useRef<HTMLIFrameElement>(null as never);

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                previewRef.current?.contentWindow?.postMessage({
                    type: data.type,
                    code: data.code,
                });
            }
            if (data.type === "notify-action" && data.notify) {
                const log = isDevelopment() ? notify : console.log;
                log(data.notify);
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
                    onClick={() => {
                        window.top?.postMessage(
                            {
                                type: "click-action",
                            },
                            "*",
                        );
                    }}
                />
            </>
        )
    }

    const renderInner = () => {
        if (isMobile) {
            return [
                <PreviewWrapper
                    onRef={(ref) => {
                        previewRef.current = ref;
                    }}
                    onFullscreenToggle={(fullScreen) => {
                        setStateContext({
                            side: "preview",
                            fullScreen,
                        })
                    }}
                    onCommercialClick={() => {
                        CommercialModal.open();
                    }}
                />,
                <EditorWrapper 
                    onRef={(ref) => {
                        editorRef.current = ref;
                    }}
                    onFullscreenToggle={(fullScreen) => {
                        setStateContext({
                            side: "editor",
                            fullScreen,
                        })
                    }}
                />,
            ];
        }
        return [
            <EditorWrapper
                onRef={(ref) => {
                    editorRef.current = ref;
                }}
                onFullscreenToggle={(fullScreen) => {
                    setStateContext({
                        side: "editor",
                        fullScreen,
                    })
                }}
            />,
            <PreviewWrapper
                onRef={(ref) => {
                    previewRef.current = ref;
                }}
                onFullscreenToggle={(fullScreen) => {
                    setStateContext({
                        side: "preview",
                        fullScreen,
                    })
                }}
                onCommercialClick={() => {
                    CommercialModal.open();
                }}
            />,
        ];
    }

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                height: `100vh`,
                width: "100vw",
            }}
        >
            <CssBaseline />
            <Header
                onCode={(code) => {
                    previewRef.current?.contentWindow?.postMessage({
                        type: "code-action",
                        force: true,
                        code,
                    });
                    editorRef.current?.contentWindow?.postMessage({
                        type: "code-action",
                        force: true,
                        code,
                    });
                }}
                onFormat={() => {
                    editorRef.current?.contentWindow?.postMessage({
                        type: "format-action",
                        force: true,
                    });
                }}
            />
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
            <Split direction={isMobile ? "vertical" : "horizontal"}>
                {renderInner()}
            </Split>
            <MantineModal />
            <SubscribeModal />
            <CommercialModal />
        </Box>
    );
};

export default App;
