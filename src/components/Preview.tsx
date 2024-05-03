import { Typography } from "@mui/material";
import { Async, IField, One, TSubject } from "react-declarative";

interface IPreviewProps {
    transpileSubject: TSubject<void>;
}

declare global {
    namespace Executor {
        export const fields: IField[];
    }
}

export const Preview = ({
    transpileSubject
}: IPreviewProps) => (
    <Async reloadSubject={transpileSubject}>
        {() => {
            if (!window.Executor) {
                return <Typography variant="body1" sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading preview...</Typography>;
            }
            return (
                <One
                    fields={window.Executor.fields}
                />
            )
        }}
    </Async>
)

export default Preview;
