import React from "react";
import { PanelProps, PushedProps } from "./types";
interface Props extends PanelProps, PushedProps {
    isMobile: boolean;
}
declare global {
    interface Window {
        ethereum?: any;
    }
}
declare const PanelBody: React.FC<Props>;
export default PanelBody;
