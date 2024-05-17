import { useMemo } from "react";

import { makeStyles } from '../../../../styles';

import classNames from "clsx";

import { Footer } from "../Footer/Footer";
import { IChunk } from "../../model/IChunk";
import usePropsContext from "../../context/PropsContext";
import { Content } from "../Content/Content";

import { Header } from "../Header/Header";

interface IContainerProps {
  className?: string;
  style?: React.CSSProperties;
}

const useStyles = makeStyles()({
  root: {
    overflow: "hidden",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
  },
  header: { minHeight: "36px" },
  content: { flex: 1 },
  footer: { minHeight: "32px" }
});

export const Container = ({ className, style }: IContainerProps) => {
  const { classes } = useStyles();
  const { steps, value, footerLabel } = usePropsContext();

  const chunks = useMemo(
    (): IChunk[] =>
      [...steps]
        .sort(({ maxValue: a }, { maxValue: b }) => b - a)
        .map((item, idx, items) => {
          const nextItem = items[idx + 1];
          const minValue = nextItem ? nextItem.maxValue : 0;
          return {
            ...item,
            minValue,
            value: item.maxValue - minValue,
          };
        }),
    [steps]
  );

  const backgroundColor = useMemo(() => {
    const chunk = chunks.find(
      ({ minValue, maxValue }) => value >= minValue && value <= maxValue
    );
    if (chunk) {
      return chunk.color;
    }
    const maxChunk = chunks.reduce((acm, cur) => {
      if (cur.minValue >= acm.minValue) {
        return cur;
      }
      return acm;
    });
    return maxChunk.color;
  }, [chunks, value]);

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <Header backgroundColor={backgroundColor}  />
      <Content backgroundColor={backgroundColor} className={classes.content} />
      {!!footerLabel && (
        <Footer backgroundColor={backgroundColor} className={classes.footer} />
      )}
    </div>
  );
};

export default Container;
