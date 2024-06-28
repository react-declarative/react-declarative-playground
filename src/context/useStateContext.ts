import { createStateProvider } from "react-declarative";

export interface IState {
    side: "preview" | "editor";
    fullScreen: boolean;
}

export const [StateContextProvider, useStateContext] = createStateProvider<IState>();

export default useStateContext;
