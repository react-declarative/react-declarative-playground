import MonacoEditor, { loader } from '@monaco-editor/react';
import { Typography } from '@mui/material';
import { useRef } from 'react';

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
                monaco.languages.typescript.typescriptDefaults.addExtraLib(value.types!, 'file:///node_modules/react-declarative/index.d.ts');
                getValueRef.current = () => editor.getValue();
                onChange(editor.getValue());
                codeManager.setValue(editor.getValue());
            }}
            onChange={() => {
                const value = getValueRef.current();
                onChange(value);
            }}
        />
    );
};

export default Editor;
