import React from "react";

import { BackgroundMode } from "./BackgroundMode";

export interface IStep {
  color: string;
  maxValue: number;
}

export interface IProps {
  className?: string;
  style?: React.CSSProperties;
  backgroundMode?: BackgroundMode;
  headerLabel?: React.ReactNode;
  footerLabel?: React.ReactNode;
  roundDigits?: number;
  valueUnit?: string;
  value: number;
  steps: IStep[];
}
