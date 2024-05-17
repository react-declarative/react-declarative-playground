import { FadeView } from "react-declarative";

import { makeStyles } from '../../styles';

import Box from "@mui/material/Box";

import TimeLossItem from "./components/TimeLossItem";

import IItem from "./model/IItem";

interface ITimeLossProps {
    items: IItem[];
}

const useStyles = makeStyles()({
    root: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    container: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    content: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'column',
    },
})

export const TimeLoss = ({
    items,
}: ITimeLossProps) => {
    const { classes } = useStyles();
    return (
        <Box className={classes.root}>
            <FadeView disableRight color="#fff" className={classes.container}>
                <div className={classes.content}>
                    {items.map((item, idx) => (
                        <TimeLossItem
                            key={idx}
                            {...item}
                        />
                    ))}
                </div>
            </FadeView>
            <Box 
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 30,
                    zIndex: 10,
                    opacity: 0.8,
                    pointerEvents: 'none',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div style={{background: '#7FB537', width: 15, height: 15, borderRadius: '3px', marginRight: '5px'}}></div>
                    <span>Done</span>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div style={{background: '#4FC0E8', width: 15, height: 15, borderRadius: '3px', marginRight: '5px'}}></div>
                    <span>In Progress</span>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div style={{background: '#FE9B31', width: 15, height: 15, borderRadius: '3px', marginRight: '5px'}}></div>
                    <span>Waiting</span>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div style={{background: '#FA5F5A', width: 15, height: 15, borderRadius: '3px', marginRight: '5px'}}></div>
                    <span>Archive</span>
                </Box>
            </Box>
        </Box>
    )
};

export default TimeLoss;
