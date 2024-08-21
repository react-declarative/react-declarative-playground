import { Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Async, ErrorBoundary, IField, One, ScrollView, cached, debounce, getErrorMessage, loadScript, singleshot, useOnce, useSubject } from "react-declarative";

import plugin from "@babel/plugin-transform-modules-umd";

import { transform, registerPlugin } from "@babel/standalone";

import { codeManager } from "../config";

registerPlugin("plugin-transform-modules-umd", plugin);

declare global {
    namespace Executor {
        export const fields: IField[];
        export const payload: {};
        export const data: {};
    }
}

interface IPreviewProps {
    onNotify: (notify: string) => void;
}

const loadScripts = singleshot(async () => {
    await loadScript("https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js");
    mapboxgl.accessToken = 'pk.eyJ1IjoidHJpcG9sc2t5cGV0ciIsImEiOiJjbHk0YWgzNmUwMGRiMmpzN3hzbjB4Z3J2In0.3oxAilQNCBFw7zO0AIbxfQ';
});

export const Preview = ({ 
    onNotify,
}: IPreviewProps) => {
    const transpileSubject = useSubject<void>();

    const doTranspile = useMemo(() => cached(([a], [b]) => a !== b, (value: string) => {
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
                                "react-declarative": "Declarative",
                                '@mui/material': "MuiMaterial",
                                '@mui/icons-material': 'MuiIcons',
                            },
                            "moduleId": "Executor"
                        }
                    ]
                ],
                parserOpts: { strictMode: false }
            });
            code = result.code;
        } catch (error) {
            onNotify(getErrorMessage(error) || "Invalid syntax");
            return;
        }
        if (!code) {
            onNotify("Empty code");
            return
        }
        try {
            eval(code);
        } catch (error) {
            onNotify(getErrorMessage(error) || "Execution failed");
            return;
        }
        console.log('Compiled', new Date());
        transpileSubject.next();
    }), []);

    const handleTranspile = useMemo(() => debounce((value: string) => {
        doTranspile(value);
    }, 2_500), []);

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                if (data.force) {
                    handleTranspile.clear();
                    doTranspile(data.code);
                } else {
                    handleTranspile(data.code);
                }
            }
        });
    }, [handleTranspile]);

    useOnce(() => {
        const code = codeManager.getValue();
        if (code) {
            doTranspile(code);
        }
    });

    return (
        <ScrollView sx={{ height: '100vh', width: '100vw' }} hideOverflowX>
            <ErrorBoundary reloadSubject={transpileSubject} onError={(error) => onNotify(getErrorMessage(error) || "Execution failed")}>
                <Async reloadSubject={transpileSubject}>
                    {async () => {
                        if (!window.Executor) {
                            return <Typography variant="body1" sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Compiling...</Typography>;
                        }
                        await loadScripts();
                        return (
                            <One
                                fields={window.Executor.fields}
                                data={window.Executor.data}
                                onChange={(data, initial) => !initial && onNotify(JSON.stringify(data, null, 2))}
                                sx={{ p: 1 }}
                                payload={window.Executor.payload}
                            />
                        )
                    }}
                </Async>
            </ErrorBoundary>
        </ScrollView>
    );
}

export default Preview;
