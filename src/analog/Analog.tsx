import { ReactNode, useContext } from "react";
import { theme } from "../watch-utility";
import { NowContext } from "../WatchContainer";

interface IAnalogScreenProps {
    themeIdx: number,
    getWeather: () => ReactNode,
    getDate: (mode: "ANALOG" | "DIGITAL") => ReactNode
}

export default function Analog({ themeIdx, getWeather, getDate }: IAnalogScreenProps) {
    const now = useContext(NowContext);
    const rotationDegrees = {
        secRotateDeg: now.sec * (360 / 60),
        minRotateDeg: now.min * (360 / 60),
        hourRotateDeg: now.hour * 30 + now.min * 0.5,
    }
    const moonRot = rotationDegrees.minRotateDeg;
    const moonRev = rotationDegrees.minRotateDeg;
    const handTransition = {
        secHand:
            rotationDegrees.secRotateDeg < 6
                ? "all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s"
                : "all 1s cubic-bezier(0, 0, 0.99, 1.02) 0s",
        minHand:
            rotationDegrees.minRotateDeg < 6
                ? "all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s"
                : "all 1s cubic-bezier(0, 0, 0.99, 1.02) 0s",
        hourHand:
            rotationDegrees.hourRotateDeg < 6
                ? "all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s"
                : "all 1s cubic-bezier(0, 0, 0.99, 1.02) 0s",
    };
    return (
        <div className="clock-container analog">
            <span className=" number twelve" style={{ color: theme[themeIdx] }}>
                12
            </span>
            <span className="number three" style={{ color: theme[themeIdx] }}>
                3
            </span>
            <span className="number six" style={{ color: theme[themeIdx] }}>
                6
            </span>
            <span className="number nine" style={{ color: theme[themeIdx] }}>
                9
            </span>
            <div className="center"></div>
            <div
                className="seconds-hand hand"
                style={{
                    transform: `rotate(${rotationDegrees.secRotateDeg}deg)`,
                    transition: handTransition.secHand,
                }}
            ></div>
            <div
                className="minute-hand hand"
                style={{
                    transform: `rotate(${rotationDegrees.minRotateDeg}deg)`,
                    transition: handTransition.minHand,
                }}
            ></div>
            <div
                className="hour-hand hand"
                style={{
                    transform: `rotate(${rotationDegrees.hourRotateDeg}deg)`,
                    transition: handTransition.hourHand,
                }}
            ></div>
            <div className="moon-center"
                style={{
                    transform: `translateX(-50%) rotate(${moonRev}deg)`,
                    transition: handTransition.minHand,
                }}>
                <div className="moon"
                    style={{
                        transform: `rotate(${moonRot}deg)`,
                        transition: handTransition.minHand,
                    }}></div>
            </div>
            {getWeather()}
            {getDate("ANALOG")}
        </div>
    );
}