import React from "react";

interface IDotsProps {
    top: number,
    left: number,
}

export default function useWatchScreen({ top, left }: IDotsProps) {
    const [screen, setScreen] = React.useState({ x: 1, y: 1 });
    React.useEffect(() => {
        const n = 50;
        if (Math.abs(top) === 0) {
            setScreen((pv) => {
                return { x: 1, y: pv.y };
            });
        } else if (Math.abs(top) === 2 * n) {
            setScreen((pv) => {
                return { x: 2, y: pv.y };
            });
        } else if (Math.abs(top) === 4 * n) {
            setScreen((pv) => {
                return { x: 3, y: pv.y };
            });
        }

        if (Math.abs(left) === 0) {
            setScreen((pv) => {
                return { x: pv.x, y: 1 };
            });
        } else if (Math.abs(left) === 2 * n) {
            setScreen((pv) => {
                return { x: pv.x, y: 2 };
            });
        } else if (Math.abs(left) === 4 * n) {
            setScreen((pv) => {
                return { x: pv.x, y: 3 };
            });
        }
    }, [top, left]);
    return screen;
}