import Card from "./Card";
import TimeLoss from "../../widgets/TimeLoss";

export const TimeLossWrapper = ({
    done_count = "50",
    inprogress_count = "50",
    waiting_count = "50",
    archive_count = "50",
}) => {
    const items = [
        {
            title: "Tripolskiy Petr",
            description: "tripolskypetr@gmail.com",
            avatar: "",
            done: parseInt(done_count || "0"),
            inprogress: parseInt(inprogress_count || "0"),
            waiting: parseInt(waiting_count || "0"),
            archive: parseInt(archive_count || "0"),
        }
    ]

    return (
        <Card label="Time loss">
            <TimeLoss items={items} />
        </Card>
    )
};

(window as any).TimeLossWrapper = TimeLossWrapper;

export default TimeLossWrapper;
