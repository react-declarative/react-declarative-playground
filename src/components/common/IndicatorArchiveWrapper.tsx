import SingleValueWidget, { SingleValueBackgroundMode } from "../../widgets/SingleValueWidget";
import Card from "./Card";

const backgroundMap: Record<string, SingleValueBackgroundMode> = {
  semi: SingleValueBackgroundMode.Semi,
  solid: SingleValueBackgroundMode.Solid,
  unset: SingleValueBackgroundMode.Unset,
};

export const IndicatorArchiveWrapper = ({
  archive_count = "50",
  archive_limit_bg = "semi",
  archive_low_limit = "100",
  archive_medium_limit = "200",
  archive_high_limit = "300",
}) => {

  const backgroundMode = archive_limit_bg
    ? backgroundMap[archive_limit_bg]
    : SingleValueBackgroundMode.Solid;

  const steps = [
    {
      color: "#2EA96F",
      maxValue: parseInt(archive_low_limit),
    },
    {
      color: "#F3A43A",
      maxValue: parseInt(archive_medium_limit),
    },
    {
      color: "#DD4049",
      maxValue: parseInt(archive_high_limit),
    },
  ];

  return (
    <Card>
      <SingleValueWidget
        headerLabel="Archive"
        backgroundMode={backgroundMode}
        steps={steps}
        value={parseInt(archive_count || "0")}
      />
    </Card>
  );
};

(window as any).IndicatorArchiveWrapper = IndicatorArchiveWrapper;

export default IndicatorArchiveWrapper;
