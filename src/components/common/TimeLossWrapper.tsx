import { Async, LoaderView } from "react-declarative";
import Card from "./Card";
import TimeLoss from "../../widgets/TimeLoss";

const Loader = LoaderView.createLoader(28);

export const TimeLossWrapper = ({
    tickets_done_count = "50",
    tickets_inprogress_count = "50",
    tickets_waiting_count = "50",
    tickets_archive_count = "50",
}) => {
    return (
        <Card label="Time loss">
            <Async Loader={Loader}>
                {async () => {

                    const items = [
                        {
                            title: "Tripolskiy Petr",
                            description: "tripolskypetr@gmail.com",
                            avatar: "",
                            done: parseInt(tickets_done_count || "0"),
                            inprogress: parseInt(tickets_inprogress_count || "0"),
                            waiting: parseInt(tickets_waiting_count || "0"),
                            archive: parseInt(tickets_archive_count || "0"),
                        }
                    ]

                    return (
                        <TimeLoss items={items} />
                    );
                }}
            </Async>
        </Card>
    )
};

(window as any).TimeLossWrapper = TimeLossWrapper;

export default TimeLossWrapper;
