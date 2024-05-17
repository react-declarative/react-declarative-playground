import { useMemo } from "react";
import classNames from "clsx";

import { makeStyles } from '../../../../styles';

import Typography from "@mui/material/Typography";

import usePropsContext from "../../context/PropsContext";

import roundNumber from "../../../../utils/roundNumber";

import { BackgroundMode } from "../../model/BackgroundMode";

interface IContentProps {
  className?: string;
  style?: React.CSSProperties;
  backgroundColor: string;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  solidBackground: {
    "& > :first-of-type": {
      color: "#fff",
      fontWeight: "bold"
    },
    "& > :last-of-type": { color: "#fff" }
  },
  unsetBackground: {
    "& > :first-of-type": {
      color: theme.palette.text.primary,
      fontWeight: "bold"
    },
    "& > :last-of-type": { color: theme.palette.text.primary, }
  },
  semiBackground: {
    "& > :first-of-type": {
      color: theme.palette.text.primary,
      fontWeight: "bold"
    },
    "& > :last-of-type": { color: theme.palette.text.primary, }
  },
  content: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2.5px',
    "& > *": { fontWeight: 'bold' },
    "& > :first-of-type": {
      fontSize: '22px',
    },
    "& > :last-of-type": { fontSize: '16px', opacity: 0.85 }
  },
}));

export const Content = ({
  className,
  style: upperStyle,
  backgroundColor,
}: IContentProps) => {
  const { classes } = useStyles();
  const {
    backgroundMode = BackgroundMode.Solid,
    roundDigits = 2,
    value,
    valueUnit = "Unit",
  } = usePropsContext();

  const style = useMemo(
    () => ({
      ...upperStyle,
      ...(backgroundMode === BackgroundMode.Solid && {
        backgroundColor,
      }),
    }),
    [backgroundColor, backgroundMode, upperStyle]
  );

  return (
    <div
      className={classNames(className, classes.root)}
      style={style}
    >
      <div className={classNames(classes.content, {
        [classes.solidBackground]: backgroundMode === BackgroundMode.Solid,
        [classes.unsetBackground]: backgroundMode === BackgroundMode.Unset,
        [classes.semiBackground]: backgroundMode === BackgroundMode.Semi,
      })}>
        <Typography>{roundNumber(value, roundDigits)}</Typography>
        <Typography>{valueUnit}</Typography>
      </div>
    </div>
  );
};

export default Content;
