import Card from "./Card";
import SpeedDonutWidget from "../../widgets/SpeedDonutWidget";

export const MonthProgressWrapper = ({
  monthprogress_count = "50",
  monthprogress_low_limit = "100",
  monthprogress_medium_limit = "200",
  monthprogress_high_limit = "300",
}) => {
  const items = [
    {
      color: "#DD4049",
      label: "Bad",
      maxValue: parseInt(monthprogress_low_limit),
    },
    {
      color: "#F3A43A",
      label: "Normal",
      maxValue: parseInt(monthprogress_medium_limit),
    },
    {
      color: "#2EA96F",
      label: "Good",
      maxValue: parseInt(monthprogress_high_limit),
    },
  ];
  return (
    <Card label="Monthly progress">
      <SpeedDonutWidget items={items} value={parseInt(monthprogress_count || "0")} />
    </Card>
  );
};

(window as any).MonthProgressWrapper = MonthProgressWrapper;

export default MonthProgressWrapper;
