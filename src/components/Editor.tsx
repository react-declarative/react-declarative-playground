import MonacoEditor from '@monaco-editor/react';
import { Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

import { useAsyncValue } from 'react-declarative';

import { codeManager } from '../config';

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

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                setValueRef.current(data.code);
            }
        });
    }, []);

    const [value] = useAsyncValue(async () => {
        const [types, react, mui, icons, code] = await Promise.all([
            fetchText("react-declarative.d.ts"),
            fetchText("react.d.ts"),
            fetchText("mui-material.d.ts"),
            fetchText("mui-icons.d.ts"),
            fetchText("code1.txt"),
        ]);
        return {
            types,
            code: codeManager.getValue() || code,
            react,
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
