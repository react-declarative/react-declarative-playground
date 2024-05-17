import SingleValueWidget, { SingleValueBackgroundMode } from "../../widgets/SingleValueWidget";
import Card from "./Card";

const backgroundMap: Record<string, SingleValueBackgroundMode> = {
  semi: SingleValueBackgroundMode.Semi,
  solid: SingleValueBackgroundMode.Solid,
  unset: SingleValueBackgroundMode.Unset,
};

export const IndicatorWaitingWrapper = ({
  waiting_count = "50",
  waiting_limit_bg = "semi",
  waiting_low_limit = "100",
  waiting_medium_limit = "200",
  waiting_high_limit = "300",
}) => {
  const backgroundMode = waiting_limit_bg
    ? backgroundMap[waiting_limit_bg]
    : SingleValueBackgroundMode.Solid;

  const steps = [
    {
      color: "#2EA96F",
      maxValue: parseInt(waiting_low_limit),
    },
    {
      color: "#F3A43A",
      maxValue: parseInt(waiting_medium_limit),
    },
    {
      color: "#DD4049",
      maxValue: parseInt(waiting_high_limit),
    },
  ];

  return (
    <Card>
      <SingleValueWidget
        headerLabel="Waiting"
        backgroundMode={backgroundMode}
        steps={steps}
        value={parseInt(waiting_count || "0")}
      />
    </Card>
  );
};

(window as any).IndicatorWaitingWrapper = IndicatorWaitingWrapper;

export default IndicatorWaitingWrapper;
