import { Async, LoaderView } from "react-declarative";
import SingleValueWidget, { SingleValueBackgroundMode } from "../../widgets/SingleValueWidget";
import Card from "./Card";

const Loader = LoaderView.createLoader(28);

const backgroundMap: Record<string, SingleValueBackgroundMode> = {
  semi: SingleValueBackgroundMode.Semi,
  solid: SingleValueBackgroundMode.Solid,
  unset: SingleValueBackgroundMode.Unset,
};

export const IndicatorProgressWrapper = ({
  tickets_inprogress_count = "50",
  inprogress_limit_bg = "semi",
  inprogress_low_limit = "100",
  inprogress_medium_limit = "200",
  inprogress_high_limit = "300",
}) => {
  return (
    <Card>
      <Async Loader={Loader}>
        {async () => {

          const backgroundMode = inprogress_limit_bg
            ? backgroundMap[inprogress_limit_bg]
            : SingleValueBackgroundMode.Solid;

          const steps = [
            {
              color: "#2EA96F",
              maxValue: parseInt(inprogress_low_limit),
            },
            {
              color: "#F3A43A",
              maxValue: parseInt(inprogress_medium_limit),
            },
            {
              color: "#DD4049",
              maxValue: parseInt(inprogress_high_limit),
            },
          ];

          return (
            <SingleValueWidget
              headerLabel="In progress"
              backgroundMode={backgroundMode}
              steps={steps}
              value={parseInt(tickets_inprogress_count || "0")}
            />
          );
        }}
      </Async>
    </Card>
  );
};

(window as any).IndicatorProgressWrapper  = IndicatorProgressWrapper;

export default IndicatorProgressWrapper;
