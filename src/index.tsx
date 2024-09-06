import "./config/polyfills";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import {
    ModalProvider,
    OneConfig,
    ScrollAdjust,
    SnackProvider,
} from "react-declarative";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import muiTheme from "./config/muiTheme";
import mantineTheme from "./config/mantineTheme";
import { ThemeProvider } from "@mui/material/styles";
import { MantineProvider } from "@mantine/core";
import { TssCacheProvider } from "tss-react";
import createCache from "@emotion/cache";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { LoaderProvider } from "./hooks/useLoader";
import { IState, StateContextProvider } from "./context/useStateContext";
import { OneSlotFactory } from "react-declarative-mantine";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw-cache.js");
}

const container = document.getElementById("root")!;

const muiCache = createCache({
    key: "mui",
    prepend: true,
});

const tssCache = createCache({
    key: "tss",
});

const INITIAL_STATE: IState = {
    side: "editor",
    fullScreen: false,
};

const wrappedApp = (
    <CacheProvider value={muiCache}>
        <TssCacheProvider value={tssCache}>
            <MantineProvider theme={mantineTheme}>
                <ThemeProvider theme={muiTheme}>
                    <OneSlotFactory>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                            <StateContextProvider initialState={INITIAL_STATE}>
                                <LoaderProvider initialState={0}>
                                    <SnackProvider>
                                        <ModalProvider>
                                            <App />
                                        </ModalProvider>
                                    </SnackProvider>
                                </LoaderProvider>
                            </StateContextProvider>
                        </LocalizationProvider>
                    </OneSlotFactory>
                </ThemeProvider>
            </MantineProvider>
        </TssCacheProvider>
    </CacheProvider>
);

const root = createRoot(container);

OneConfig.setValue({
    WITH_DIRTY_CLICK_LISTENER: true,
    WITH_MOBILE_READONLY_FALLBACK: true,
    WITH_WAIT_FOR_MOVE_LISTENER: true,
    WITH_WAIT_FOR_TOUCH_LISTENER: true,
    WITH_DISMOUNT_LISTENER: true,
    WITH_SYNC_COMPUTE: true,
    CUSTOM_FIELD_DEBOUNCE: 800,
    FIELD_BLUR_DEBOUNCE: 50,
});

ScrollAdjust.setAdjustHeight(25);

document.addEventListener("wheel", () => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement && activeElement.type === "number") {
        activeElement.blur();
    }
});

root.render(wrappedApp);
