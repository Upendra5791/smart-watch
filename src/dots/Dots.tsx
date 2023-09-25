import useWatchScreen from "../hooks/useWatchScreen";

interface IDotsProps {
    top: number,
    left: number,
    axis: string,
    idx: number
}

export default function Dots({ top, left, axis, idx }: IDotsProps) {

    let classlist = ["dot"];
    const screen = useWatchScreen({top,left});
    if (
        (axis === "x" && idx === screen.x) ||
        (axis === "y" && idx === screen.y)
    )
        classlist.push("filled");
    return <span className={classlist.join(" ")}></span>;


}