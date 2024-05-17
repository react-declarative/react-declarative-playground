import * as React from "react";

import { SxProps, alpha } from "@mui/material/styles";
import { makeStyles } from "../../styles";

import clsx from "clsx";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: theme.palette.background.paper,
    },
    label: {
        minHeight: '35px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '6px',
        opacity: 0.5,
        background: alpha("#000", 0.1),
    },
    container: {
        position: 'relative',
        flex: 1,
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
    }
}));

interface ICardProps {
    label?: string;
    sx?: SxProps;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card = ({
    children = null,
    className,
    style,
    sx,
    label,
}: ICardProps) => {
    const { classes } = useStyles();
    return (
        <Paper className={clsx(classes.root, className)} sx={sx} style={style}>
            {!!label && <Typography className={classes.label}>{label}</Typography>}
            <div className={classes.container}>
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </Paper>
    );
};

export default Card;
