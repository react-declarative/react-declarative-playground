import { Box, Typography } from "@mui/material";
import { Async, ErrorBoundary, IField, One, ScrollView, TSubject, getErrorMessage, useSnack } from "react-declarative";

interface IPreviewProps {
    transpileSubject: TSubject<void>;
}

declare global {
    namespace Executor {
        export const fields: IField[];
    }
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
    transpileSubject
}: IPreviewProps) => {
    const snack = useSnack();
    return (
        <ScrollView sx={{ height: '100%', width: '100%' }} hideOverflowX>
            <ErrorBoundary reloadSubject={transpileSubject} onError={(error) => snack(getErrorMessage(error) || "Execution failed")}>
                <Async reloadSubject={transpileSubject}>
                    {() => {
                        if (!window.Executor) {
                            return <Typography variant="body1" sx={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading preview...</Typography>;
                        }
                        return (
                            <One
                                fields={window.Executor.fields}
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
