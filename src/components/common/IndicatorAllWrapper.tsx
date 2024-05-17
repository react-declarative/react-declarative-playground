import { Async, LoaderView } from "react-declarative";
import SingleValueWidget, { SingleValueBackgroundMode } from "../../widgets/SingleValueWidget";
import Card from "./Card";

const Loader = LoaderView.createLoader(28);

const backgroundMap: Record<string, SingleValueBackgroundMode> = {
  semi: SingleValueBackgroundMode.Semi,
  solid: SingleValueBackgroundMode.Solid,
  unset: SingleValueBackgroundMode.Unset,
};

export const IndicatorAllWrapper = ({
  tickets_all_count = "50",
  all_limit_bg = "semi",
  all_low_limit = "100",
  all_medium_limit = "200",
  all_high_limit = "300",
}) => {
  return (
    <Card>
      <Async Loader={Loader}>
        {async () => {

          const backgroundMode = all_limit_bg
            ? backgroundMap[all_limit_bg]
            : SingleValueBackgroundMode.Solid;

          const steps = [
            {
              color: "#DD4049",
              maxValue: parseInt(all_low_limit),
            },
            {
              color: "#F3A43A",
              maxValue: parseInt(all_medium_limit),
            },
            {
              color: "#2EA96F",
              maxValue: parseInt(all_high_limit),
            },
          ];

          return (
            <SingleValueWidget
              backgroundMode={backgroundMode}
              headerLabel="All"
              steps={steps}
              value={parseInt(tickets_all_count || "0")}
            />
          );
        }}
      </Async>
    </Card>
  );
};

(window as any).IndicatorAllWrapper = IndicatorAllWrapper;

export default IndicatorAllWrapper;
