import { useMemo, useState } from 'react';

import { makeStyles } from '../styles';
import { alpha, darken, Theme } from '@mui/material';

import { Center, PortalView, RevealView, Countdown, openBlank, createLsManager, Subject, useOnce, copyToClipboard, useSnack } from 'react-declarative';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const LOGO_HEIGHT = 225;

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: alpha('#000', 0.3),
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
        marginBottom: '3.5vw',
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

const openSubject = new Subject<void>();

export const CommercialModal = () => {
    const { classes } = useStyles();

    const [opened, setOpened] = useState(false);
    const notify = useSnack();

    useOnce(() => openSubject.subscribe(() => setOpened(true)));

    const handleSubmit = () => {
        copyToClipboard("tripolskypetr@gmail.com");
        notify("Email copied to clipboard");
        openBlank("mailto:tripolskypetr@gmail.com");
        setOpened(false);
    };

    const renderLogo = () => (
        <>
            <Box className={classes.avatarRoot}>
                <Stack alignItems="center" gap={1}>
                    <Center>
                        <Box
                            component="img"
                            src="/peter.png"
                            loading='lazy'
                            sx={{ width: 128, height: 128, borderRadius: '50%' }}
                        />
                    </Center>
                    <Typography variant="h6">Peter Tripolsky</Typography>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ color: (theme: Theme) => theme.palette.text.secondary }}
                    >
                        The Creator of <b>react-declarative</b>
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
            <Box className={classes.root} onClick={() => setOpened(false)}>
                <RevealView className={classes.reveal}>
                    <Paper className={classes.container}>
                        <Stack direction='column' gap="15px">
                            {renderLogo()}
                            <span style={{ marginTop: -10 }}>
                                Move faster by hiring Outsource Company 👷. We have developed 💻 a lot IT of projects<br /><br />
                                This includes AI and enterprise software development 😃<br /><br />
                            </span>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Schedule the meeting
                            </Button>
                        </Stack>
                    </Paper>
                </RevealView>
            </Box>
        </PortalView>
    );
};

CommercialModal.open = () => openSubject.next();

export default CommercialModal;
