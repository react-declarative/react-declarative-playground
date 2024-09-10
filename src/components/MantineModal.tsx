import { ActionBounce, ActionState, createLsManager, openBlank, useChangeSubject, useOnce, useSubject } from "react-declarative";
import { CC_ENABLE_MANTINE_PROMOTE } from "../config/params";
import { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, ClickAwayListener, IconButton, Paper, Typography } from "@mui/material";
import Mantine from "../icons/Mantine";
import { Close } from "@mui/icons-material";

const STORAGE = createLsManager<boolean>("REACT_DECLARATIVE_PLAYGROUND_FIRST_MANTINE");

const THEME = createTheme();
const EMIT_CLICK_COUNT = 15;
const ANIMATION_DELAY = 100;

export const MantineModal = () => {

    const [open, setOpen] = useState(false);

    const stateSubject = useSubject<ActionState>();

    const openSubject = useChangeSubject(open);

    useOnce(() => {
        let counter = 0;
        const commitClick = () => {
            if (STORAGE.getValue()) {
                return;
            }
            if (++counter === EMIT_CLICK_COUNT) {
                setOpen(true);
                STORAGE.setValue(true);
            }
        };
        window.addEventListener("message", ({ data }) => {
            if (data.type === "click-action") {
                commitClick();
            }
        });
        openSubject.debounce(ANIMATION_DELAY).connect(() => {
            stateSubject.next(ActionState.Abort);
        });
    });

    if (!CC_ENABLE_MANTINE_PROMOTE) {
        return;
    }

    const renderInner = () => {
        if (!open) {
            return null;
        }
        return (
            <ActionBounce
                transparentPaper
                stateSubject={stateSubject}
                sx={{
                    position: 'fixed',
                    top: '8px',
                    right: '8px',
                    pl: 1,
                    zIndex: 999,
                }}
                onAnimationEnd={(state) => {
                    if (state === ActionState.Abort) {
                        stateSubject.next(ActionState.Initial);
                    }
                }}
            >
                <Card sx={{ position: 'relative' }}>
                    <IconButton size="large" sx={{ position: 'absolute', top: '2px', right: '2px' }} onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                    <CardHeader
                        avatar={
                            <Mantine />
                        }
                        title={(
                            <Typography variant="h5" component="div">
                                The Mantine Design
                            </Typography>
                        )}
                        subheader={(
                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                Single-line design upgrade
                            </Typography>
                        )}
                    />
                    <CardContent>
                        <Typography variant="body2">
                            Hey! Check out how your app will look with the new theme installed.🎉<br />
                            You don't have to change any JSON schemas 😊
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            onClick={() => {
                                openBlank("https://react-declarative-mantine.github.io?skip_first_view=1");
                                setOpen(false);
                            }}
                        >
                            Continue
                        </Button>
                    </CardActions>
                </Card>
            </ActionBounce>
        );
    }

    return (
        <ThemeProvider theme={THEME}>
            {renderInner()}
        </ThemeProvider>
    );
};

export default MantineModal;

