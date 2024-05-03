import { CssBaseline, LinearProgress } from "@mui/material";
import Editor from "./Editor";
import useLoader from "../hooks/useLoader";

import plugin from "@babel/plugin-transform-modules-umd";

import { transform, registerPlugin } from "@babel/standalone";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useSubject, useSnack, getErrorMessage } from "react-declarative";
import Split from 'react-split-it';
import EditorWrapper from "./EditorWrapper";
import Preview from "./Preview";

registerPlugin("plugin-transform-modules-umd", plugin);

export const App = () => {
    const [loader] = useLoader();
    const notify = useSnack();

    const transpileSubject = useSubject<void>();

    const isMonacoPage = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('monaco');
    }, []);

    const handleTranspile = useMemo(() => debounce((value: string) => {
        let code: string | null | undefined = null;
        console.log('Compiling', new Date());
        try {
            const result = transform(value, {
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
            code = result.code;
        } catch (error) {
            notify(getErrorMessage(error) || "Invalid syntax");
            return;
        }
        if (!code) {
            notify("Empty code");
            return
        }
        try {
            eval(code);
        } catch (error) {
            notify(getErrorMessage(error) || "Execution failed");
            return;
        }
        console.log('Compiled', new Date());
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
                <Preview transpileSubject={transpileSubject} />
            </Split>
        </>
    );
};

export default App;
