import { Async, LoaderView } from "react-declarative";
import SingleValueWidget, { SingleValueBackgroundMode } from "../../widgets/SingleValueWidget";
import Card from "./Card";

const Loader = LoaderView.createLoader(28);

const backgroundMap: Record<string, SingleValueBackgroundMode> = {
  semi: SingleValueBackgroundMode.Semi,
  solid: SingleValueBackgroundMode.Solid,
  unset: SingleValueBackgroundMode.Unset,
};

export const IndicatorDoneWrapper = ({
  tickets_done_count = "50",
  done_limit_bg = "semi",
  done_low_limit = "100",
  done_medium_limit = "200",
  done_high_limit = "300",
}) => {
  return (
    <Card>
      <Async Loader={Loader}>
        {async () => {

          const backgroundMode = done_limit_bg
            ? backgroundMap[done_limit_bg]
            : SingleValueBackgroundMode.Solid;

          const steps = [
            {
              color: "#DD4049",
              maxValue: parseInt(done_low_limit),
            },
            {
              color: "#F3A43A",
              maxValue: parseInt(done_medium_limit),
            },
            {
              color: "#2EA96F",
              maxValue: parseInt(done_high_limit),
            },
          ];

          return (
            <SingleValueWidget
              backgroundMode={backgroundMode}
              headerLabel="Done"
              steps={steps}
              value={parseInt(tickets_done_count || "0")}
            />
          );
        }}
      </Async>
    </Card>
  );
};

(window as any).IndicatorDoneWrapper = IndicatorDoneWrapper;

export default IndicatorDoneWrapper;
