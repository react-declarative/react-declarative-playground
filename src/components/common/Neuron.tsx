import { AutoSizer, Square, useElementSize } from "react-declarative";

import { NeuralNetwork, utilities } from "brain.js";

import Box from "@mui/material/Box";
import { useEffect, useLayoutEffect, useRef } from "react";

interface IPreviewProps {    
    hiddenLayers: number[];
}

const CC_INPUT_SIZE = 10;
const CC_OUTPUT_SIZE = 2;

export const Neuron = ({ hiddenLayers }: IPreviewProps) => {

  const targetRef = useRef<HTMLDivElement>(null);

  const { elementRef, size } = useElementSize({
    selector: 'div'
  });

  const handleElement = (ref: HTMLDivElement, side: number) => {
    const config = {
        inputSize: CC_INPUT_SIZE,
        hiddenLayers: Object.values(hiddenLayers).filter(v => v),
        outputSize: CC_OUTPUT_SIZE,
    };
    ref.innerHTML = utilities.toSVG(new NeuralNetwork(config), {
      fontSize: "12px",
      width : side,
      height : side,
      radius: 6,
      line: {
        className: "net-preview__line",
        width: 0.5,
        color: "rgba(255,255,255,1)",
      },
      hidden: {
        className: "net-preview__hidden",
        color: "rgba(255,127,80,0.6)",
      },
      outputs: {
        className: "net-preview__outputs",
        color: "rgba(100,149,237,0.6)",
      },
      inputs: { className: "net-preview__inputs", color: "rgba(0,127,0,0.6)" },
    });
  };

  useLayoutEffect(() => {
    if (!size.width) {
      return;
    }
    if (!targetRef.current) {
        return;
    }
    handleElement(targetRef.current, size.width);
  }, [size.width]);

  return (
    <Square
      ref={elementRef}
      sx={{
        position: 'relative',
        marginTop: "20px",
        width: "100%",
      }}
    >
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up("sm")]: {
              position: 'absolute',
              top: 0,
              left: 0,
              ...size
          },
        })}
        ref={targetRef}
      />
    </Square>
  );
};

(window as any).Neuron = Neuron;

export default Neuron;
