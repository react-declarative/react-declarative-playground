import React from "react";

export interface IItem {
  label: string;
  color: string;
  maxValue: number;
}

export interface IProps {
  className?: string;
  style?: React.CSSProperties;
  roundDigits?: number;
  valueUnit?: string;
  items: IItem[];
  value: number;
}
