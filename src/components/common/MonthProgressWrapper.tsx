import { Async, LoaderView } from "react-declarative";
import Card from "./Card";
import SpeedDonutWidget from "../../widgets/SpeedDonutWidget";

const Loader = LoaderView.createLoader(28);

export const MonthProgressWrapper = ({
  tickets_done_count = "50",
  monthprogress_low_limit = "100",
  monthprogress_medium_limit = "200",
  monthprogress_high_limit = "300",
}) => {
  return (
    <Card label="Monthly progress">
      <Async Loader={Loader}>
        {async () => {
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
            <SpeedDonutWidget items={items} value={parseInt(tickets_done_count || "0")} />
          );
        }}
      </Async>
    </Card>
  );
};

(window as any).MonthProgressWrapper = MonthProgressWrapper;

export default MonthProgressWrapper;
