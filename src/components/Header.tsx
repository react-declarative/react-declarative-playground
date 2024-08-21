import { GitHub, KeyboardArrowDown } from "@mui/icons-material";
import { Button, IconButton, MenuItem, Popover } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { chooseFile, downloadBlank, openBlank } from "react-declarative";

const fetchText = async (url: string) => {
    const responce = await fetch(url);
    return await responce.text();
};

const itemList = [
    {
        url: 'code1.txt',
        label: 'Order info',
    },
    {
        url: 'code2.txt',
        label: 'Typography',
    },
    {
        url: 'code3.txt',
        label: 'Settings page',
    },
    {
        url: 'code4.txt',
        label: 'Product Shape',
    },
    {
        url: 'code5.txt',
        label: 'Profile card',
    },
    {
        url: 'code6.txt',
        label: 'Gallery of controls',
    },
    {
        url: 'code7.txt',
        label: 'Variant form',
    },
    {
        url: 'code8.txt',
        label: 'Custom JSX',
    },
    {
        url: 'code9.txt',
        label: 'Machine learning',
    },
    {
        url: 'code10.txt',
        label: 'Dashboard',
    },
    {
        url: 'code11.txt',
        label: 'Adaptive form',
    },
    {
        url: 'code12.txt',
        label: 'Account info',
    },
    {
        url: 'code13.txt',
        label: 'Sign in form',
    },
    {
        url: 'code14.txt',
        label: 'Crypto exchange',
    },
    {
        url: 'code15.txt',
        label: 'KPI Review',
    },
    {
        url: 'code16.txt',
        label: 'Stocks Chart',
    },
    {
        url: 'code17.txt',
        label: 'Schema mapping',
    },
    {
        url: 'code18.txt',
        label: 'Snackbar validation',
    },
    {
        url: 'code19.txt',
        label: 'Mapbox interop',
    },
    {
        url: 'code20.txt',
        label: 'Reflection',
    },
    {
        url: 'code21.txt',
        label: 'Mall map',
    },
    {
        url: 'code22.txt',
        label: 'Rate card',
    },
    {
        url: 'code23.txt',
        label: 'Google Forms',
    },
];

interface IHeaderProps {
    onCode: (code: string) => void;
    onFormat: () => void;
}

export const Header = ({
    onCode,
    onFormat,
}: IHeaderProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const codeRef = useRef<string>("");

    useEffect(() => {
        window.addEventListener("message", ({ data }) => {
            if (data.type === "code-action" && data.code) {
                codeRef.current = data.code;
            }
        });
    }, []);

    const renderMenu = () => (
        <Popover
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            sx={{
                maxHeight: '80vh',
                overflowY: 'scroll',
                overflowX: 'hidden',
                scrollbarWidth: 'thin'
            }}
        >
            {itemList.map(({ label, url }) => (
                <MenuItem key={url} onClick={async () => { const code = await fetchText(url); onCode(code); setAnchorEl(null); }}>
                    {label}
                </MenuItem>
            ))}
        </Popover>
    );

    return (
        <AppBar position="relative" sx={{ marginBottom: '2px' }}>
            <Toolbar variant="dense" sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => openBlank("https://github.com/react-declarative/react-declarative")}
                >
                    Playground
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        flexWrap: 'nowrap',
                        gap: 1,
                        ml: 1,
                        maxWidth: { xs: 'calc(100vw - 200px)', sm: 'inherit' },
                        minWidth: { xs: 'calc(100vw - 200px)', sm: 'inherit' },
                        scrollbarWidth: 'none',
                    }}
                >
                    <Button
                        size="small"
                        sx={{ color: '#fff', ml: 2, display: { xs: 'none', sm: 'flex' } }}
                        onClick={async () => {
                            const file = await chooseFile(".ts");
                            if (!file) {
                                return;
                            }
                            const reader = new FileReader();
                            reader.addEventListener(
                                "load",
                                () => {
                                    onCode(reader.result as string);
                                },
                                false,
                            );
                            if (file) {
                                reader.readAsText(file);
                            }
                        }}
                    >
                        Open
                    </Button>
                    <Button
                        size="small"
                        sx={{ color: '#fff', ml: 1, display: { xs: 'none', sm: 'flex' } }}
                        onClick={() => {
                            const blob = new Blob([codeRef.current]);
                            const url = URL.createObjectURL(blob);
                            downloadBlank(url, "form.assets.ts");
                        }}
                    >
                        Download
                    </Button>
                    <Button
                        size="small"
                        sx={{ color: '#fff', ml: 1, display: { xs: 'none', sm: 'flex' } }}
                        onClick={() => openBlank("https://github.com/react-declarative/react-declarative/tree/master/docs")}
                    >
                        Docs
                    </Button>
                    <Button
                        size="small"
                        endIcon={<KeyboardArrowDown />}
                        sx={{ color: '#fff', ml: 1 }}
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                    >
                        Demos
                    </Button>
                </Box>
                {renderMenu()}
                <div style={{ flex: 1 }} />
                <Button
                    size="small"
                    sx={{ color: '#fff', ml: 1, mr: 2, display: { xs: 'none', sm: 'flex' } }}
                    onClick={onFormat}
                >
                    Prettier
                </Button>
                <IconButton onClick={() => openBlank('https://github.com/react-declarative/react-declarative')}>
                    <GitHub />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header;
