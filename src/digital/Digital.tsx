import { ReactNode } from "react";
import { theme } from "../watch-utility";

interface IDigitalScreenProps {
    themeIdx: number,
    getWeather: () => ReactNode,
    getDate: (mode: "ANALOG" | "DIGITAL") => ReactNode
}
export default function Digital({themeIdx, getWeather, getDate}: IDigitalScreenProps) {
    const now = {
        hour: new Date().getHours(),
        min: new Date().getMinutes(),
    }
    return (
        <div className="clock-container digital">
            <div className="hour number" style={{ color: theme[themeIdx] }}>
                <span>{now.hour}</span>
            </div>
            <div
                className="minute number"
                style={{
                    color:
                        themeIdx === theme.length - 1
                            ? theme[themeIdx]
                            : theme[themeIdx + 1],
                }}
            >
                <span>{now.min}</span>
            </div>
            {getWeather()}
            {getDate("DIGITAL")}
        </div>
    );
}