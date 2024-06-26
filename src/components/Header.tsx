import { GitHub, KeyboardArrowDown } from "@mui/icons-material";
import { Button, IconButton, MenuItem, Popover } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { ActionButton, chooseFile, downloadBlank, openBlank } from "react-declarative";

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
];

interface IHeaderProps {
    onCode: (code: string) => void;
}

export const Header = ({
    onCode,
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
        <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{ horizontal: "left", vertical: "bottom" }}>
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
                >
                    Playground
                </Typography>
                <Button
                    size="small"
                    sx={{ color: '#fff', ml: 2 }}
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
                    sx={{ color: '#fff', ml: 1 }}
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
                    endIcon={<KeyboardArrowDown />}
                    sx={{ color: '#fff', ml: 1, display: { xs: 'none', sm: 'flex' } }}
                    onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                >
                    Demos
                </Button>
                {renderMenu()}
                <div style={{ flex: 1 }} />
                <IconButton onClick={() => openBlank('https://github.com/react-declarative/react-declarative')}>
                    <GitHub />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header;
