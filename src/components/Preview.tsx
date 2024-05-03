import { Box, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Async, ErrorBoundary, IField, One, ScrollView, TSubject, debounce, getErrorMessage, useSnack, useSubject } from "react-declarative";

import plugin from "@babel/plugin-transform-modules-umd";

import { transform, registerPlugin } from "@babel/standalone";

registerPlugin("plugin-transform-modules-umd", plugin);

declare global {
    namespace Executor {
        export const fields: IField[];
    }
}

interface IPreviewProps {
    onNotify: (notify: string) => void;
}

const payload = {
    profileStatus: {
        "unknown": "First contact",
        "active": "Active",
        "inactive": "Inactive",
    },
    profileGroup: {
        "group-1": "Group 1",
    },
    profileSource: {
        "telegram": "Telegram"
    },
    lookingFor: {
        "house": "House",
        "garage": "Garage",
    },
    countries: {
        "usa": "USA",
        "turkey": "Turkey",
        "uzbekistan": "Uzbekistan",
    },
}

export const Preview = ({ 
    onNotify,
}: IPreviewProps) => {
    const transpileSubject = useSubject<void>();

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
    }, 1_000), []);

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                handleTranspile(data.code);
            }
        });
    }, [handleTranspile]);

    return (
        <ScrollView sx={{ height: '100vh', width: '100vw' }} hideOverflowX>
            <ErrorBoundary reloadSubject={transpileSubject} onError={(error) => onNotify(getErrorMessage(error) || "Execution failed")}>
                <Async reloadSubject={transpileSubject}>
                    {() => {
                        if (!window.Executor) {
                            return <Typography variant="body1" sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading preview...</Typography>;
                        }
                        return (
                            <One
                                fields={window.Executor.fields}
                                onChange={(data, initial) => !initial && onNotify(JSON.stringify(data, null, 2))}
                                sx={{ p: 1 }}
                                payload={payload}
                            />
                        )
                    }}
                </Async>
            </ErrorBoundary>
        </ScrollView>
    );
}

export default Preview;
