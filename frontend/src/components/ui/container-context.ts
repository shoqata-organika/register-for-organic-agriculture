import { createContext } from "react";

export const ContainerContext = createContext<{element?: HTMLElement | null}>(
    { element: null }
);