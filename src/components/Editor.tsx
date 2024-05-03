import MonacoEditor from '@monaco-editor/react';
import { Typography } from '@mui/material';
import { useRef } from 'react';
import { MonacoJsxSyntaxHighlight, getWorker } from 'monaco-jsx-syntax-highlight'

import { useAsyncValue, createLsManager } from 'react-declarative';

const fetchText = async (url: string) => {
    const responce = await fetch(url);
    return await responce.text();
};

interface IEditorProps {
    onChange: (value: string) => void;
}

const codeManager = createLsManager<string>("react-declarative-playground-code");

export const Editor = ({
    onChange,
}: IEditorProps) => {
    const getValueRef = useRef<() => string>(null as never);

    const [value] = useAsyncValue(async () => {
        const [types, code] = await Promise.all([
            fetchText("react-declarative.d.ts"),
            fetchText("code.txt")
        ]);
        return {
            types,
            code: codeManager.getValue() || code,
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
            defaultValue={value.code}
            onMount={(editor, monaco) => {

                const controller = new MonacoJsxSyntaxHighlight(getWorker(), monaco);
                const {highlighter} = controller.highlighterBuilder({
                    editor,
                });
                highlighter();

                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                    jsx: monaco.languages.typescript.JsxEmit.React,
                    jsxFactory: 'React.createElement',
                    reactNamespace: 'React',
                    target: monaco.languages.typescript.ScriptTarget.ES2020,
                  });
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.types!, 'file:///node_modules/react-declarative/index.d.ts');
                getValueRef.current = () => editor.getValue();
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
