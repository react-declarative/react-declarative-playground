import { CssBaseline, LinearProgress } from "@mui/material";
import Editor from "./Editor";
import useLoader from "../hooks/useLoader";

import plugin from "@babel/plugin-transform-modules-umd";

import { transform, registerPlugin } from "@babel/standalone";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useSubject } from "react-declarative";
import Split from 'react-split-it';
import EditorWrapper from "./EditorWrapper";

registerPlugin("plugin-transform-modules-umd", plugin);

export const App = () => {
    const [loader] = useLoader();

    const transpileSubject = useSubject<void>();

    const isMonacoPage = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('monaco');
    }, []);

    const handleTranspile = useMemo(() => debounce((value: string) => {
        const { code } = transform(value, {
            filename: 'index.tsx',
            presets: ['env', 'react', 'typescript'],
            plugins: [
                [
                    "plugin-transform-modules-umd",
                    {
                        "globals": {
                            "react": "React",
                            "react-declarative": "Declarative"
                        },
                        "moduleId": "Executor"
                    }
                ]
            ],
            parserOpts: { strictMode: false }
        });
        if (!code) {
            return
        }
        eval(code);
        transpileSubject.next();
    }, 1_000), []);

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                handleTranspile(data.code);
            }
        });
    }, [handleTranspile]);

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
                <EditorWrapper />
            </Split>
        </>
    );
};

export default App;
