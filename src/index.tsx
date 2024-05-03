import "./config/polyfills";

import {
    OneConfig,
    ScrollAdjust,
} from "react-declarative";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import THEME_DARK from "./config/theme";
import { ThemeProvider } from "@mui/material/styles";
import { TssCacheProvider } from "tss-react";
import createCache from "@emotion/cache";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { LoaderProvider } from "./hooks/useLoader";

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

const wrappedApp = (
    <CacheProvider value={muiCache}>
        <TssCacheProvider value={tssCache}>
            <ThemeProvider theme={THEME_DARK}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <LoaderProvider initialState={0}>
                        <App />
                    </LoaderProvider>
                </LocalizationProvider>
            </ThemeProvider>
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
