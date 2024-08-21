import { useMemo, useState } from 'react';

import { makeStyles } from '../styles';
import { alpha, darken, Link, Theme } from '@mui/material';

import { Center, PortalView, RevealView, Countdown, openBlank, createLsManager } from 'react-declarative';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import Logo from '../icons/Logo';

const LOGO_HEIGHT = 225;
const STORAGE = createLsManager<boolean>("REACT_DECLARATIVE_PLAYGROUND_FIRST_VIEW");

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: alpha('#000', 0.2),
        backdropFilter: 'saturate(180%) blur(20px)',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
        padding: 15,
    },
    container: {
        position: "relative",
        marginBottom: '10vw',
        overflow: "hidden",
        maxWidth: 375,
        padding: 15,
    },
    reveal: {
        width: 'unset !important',
    },
    avatarRoot: {
        position: "absolute",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: LOGO_HEIGHT,
        background: darken(theme.palette.background.paper, 0.12),
    },
    avatarAdjust: {
        paddingBottom: LOGO_HEIGHT,
    },
}));

export const ConnectPage = () => {
    const { classes } = useStyles();

    const [disabled, setDisabled] = useState(true);
    const [opened, setOpened] = useState(() => !STORAGE.getValue());

    const handleClose = () => {
        STORAGE.setValue(true);
        setOpened(false);
    };

    const expireAt = useMemo(() => Date.now() + 5000, []);

    const renderLogo = () => (
        <>
            <Box className={classes.avatarRoot}>
                <Stack alignItems="center" gap={1}>
                    <Center>
                        <Box
                            sx={{ width: 128, height: 128, borderRadius: '50%' }}
                        >
                            <Logo />
                        </Box>
                    </Center>
                    <Typography variant="h6">React Declarative</Typography>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ color: (theme: Theme) => theme.palette.text.secondary }}
                    >
                        Looking for promotion
                    </Typography>
                </Stack>
            </Box>
            <div className={classes.avatarAdjust} />
        </>
    );

    if (!opened) {
        return null;
    }

    return (
        <PortalView>
            <Box className={classes.root}>
                <RevealView className={classes.reveal}>
                    <Paper className={classes.container}>
                        <Stack direction='column' gap="15px">
                            {renderLogo()}
                            <span style={{ marginTop: -10 }}>
                                Made by using <Link href="#" onClick={() => openBlank("https://github.com/react-declarative/react-declarative")}>react-declarative</Link> to solve your problems. ⭐Star and 💻Fork It on github will be appreciated<br /><br />
                                While app still opening why don't you <strong>proceed the link</strong> to bookmark it and stay in touch<span className="emoji">😃</span><br /><br />
                            </span>
                            <Button
                                disabled={disabled}
                                variant="contained"
                                onClick={handleClose}
                            >
                                <Countdown expireAt={expireAt} onExpire={() => setDisabled(false)}>
                                    Continue to playground
                                </Countdown>
                            </Button>
                        </Stack>
                    </Paper>
                </RevealView>
            </Box>
        </PortalView>
    );
};

export default ConnectPage;
