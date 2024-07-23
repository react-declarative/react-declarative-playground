import MonacoEditor from '@monaco-editor/react';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';

import { useAsyncValue } from 'react-declarative';

import { codeManager } from '../config';

import * as parserTypeScript from "prettier/plugins/typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";

import { format } from "prettier";

const fetchText = async (url: string) => {
    const responce = await fetch(url);
    return await responce.text();
};

interface IEditorProps {
    onChange: (value: string) => void;
}

export const Editor = ({
    onChange,
}: IEditorProps) => {
    const getValueRef = useRef<() => string>(null as never);
    const setValueRef = useRef<(text: string) => void>(null as never);

    const formatCode = useCallback(async () => {
        if (!getValueRef.current || !setValueRef.current) {
            return;
        }
        const code = getValueRef.current();
        const formatcode = await format(code, {
            semi: true,
            endOfLine: "auto",
            trailingComma: "all",
            singleQuote: false,
            printWidth: 80,
            tabWidth: 2,
            parser: 'typescript',
            plugins: [parserTypeScript, prettierPluginEstree],
        });
        formatcode && setValueRef.current(formatcode);
    }, []);

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                setValueRef.current(data.code);
            }
            if (data.type === "format-action") {
                formatCode();
            }
        });
    }, []);

    const [value] = useAsyncValue(async () => {
        const [types, react, global, mui, icons, code] = await Promise.all([
            fetchText("react-declarative.d.ts"),
            fetchText("react.d.ts"),
            fetchText("global.d.ts"),
            fetchText("mui-material.d.ts"),
            fetchText("mui-icons.d.ts"),
            fetchText("code1.txt"),
        ]);
        return {
            types,
            code: codeManager.getValue() || code,
            react,
            global,
            mui,
            icons,
        };
    });

    if (!value) {
        return <Typography variant='body1' sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading editor...</Typography>;
    }

    return (
        <MonacoEditor
            height="100vh"
            defaultLanguage="typescript"
            theme="vs-dark"
            onMount={(editor, monaco) => {
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
                    jsx: monaco.languages.typescript.JsxEmit.React,
                    jsxFactory: 'React.createElement',
                    jsxFragmentFactory: "React.Fragment",
                    reactNamespace: 'React',
                    target: monaco.languages.typescript.ScriptTarget.ES2020,
                  });
                const codeModel = monaco.editor.createModel(
                    value.code,
                    "typescript",
                    monaco.Uri.file("index.tsx"),
                );
                editor.setModel(codeModel);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.types!, 'file:///node_modules/react-declarative/index.d.ts');
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.react!, 'file:///node_modules/react/index.d.ts');
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.global!, 'file:///node_modules/global/index.d.ts');
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.mui!, 'file:///node_modules/@mui/material/index.d.ts');
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.icons!, 'file:///node_modules/@mui/icons-material/index.d.ts');
                getValueRef.current = () => editor.getValue();
                setValueRef.current = (code) => editor.setValue(code);
                onChange(editor.getValue());
            }}
            onChange={() => {
                const value = getValueRef.current();
                codeManager.setValue(value);
                onChange(value);
            }}
        />
    );
};

export default Editor;
