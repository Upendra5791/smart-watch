import { Calendar } from "./calendar/Calendar";
import { DailyWeather } from "./daily-weather/DailyWeather";
import { HourlyWeather } from "./hourly-weather/HourlyWeather";
import {
    days,
    getWeatherIconString,
    theme,
    weatherCodeMap,
    Touch
} from "./watch-utility";
import './watch.css';
import Dots from "./dots/Dots";
import Digital from "./digital/Digital";
import Analog from "./analog/Analog";
import { WeatherContext } from "./WatchContainer";
import { useCallback, useContext, useEffect, useState } from "react";

const dots = [
    {idx: 1},
    {idx: 2},
    {idx: 3}
]

export function Watch() {
    /* _________________________ layout ___________________________  */
    const [defaultTouch, setDefaultTouch] = useState<Touch>();
    const [left, setLeft] = useState<number>(0);
    const [top, setTop] = useState<number>(0);
    const [scrollOpacity, setScrollOpacity] = useState(0.2);
    const [themeIdx, setThemeIdx] = useState(0);
    const [astroMode, setAstroMode] = useState<number>(0);
    /* _________________________ layout ___________________________  */
    
    const now = {
        day: new Date().getDay(),
        date: new Date().getDate(),
    }
    const weather = useContext(WeatherContext);

    /*  Handle screen swipes in x and y direction */
    const setDirection = useCallback((deltaX: number, deltaY: number) => {
        let pos = {
            leftPos: left, topPos: top
        }
        if (left > 20) {
            return { ...pos, leftPos: 0 };
        }
        if (left < -220) {
            return { ...pos, leftPos: -200 };
        }
        if (top > 20) {
            return { ...pos, topPos: 0 };
        }
        if (Math.abs(top) > 200 && Math.abs(top) < 250) {
            return { ...pos, top: -200 };
        }
        if (Math.abs(deltaX) > Math.abs(deltaY) && top !== 0) {
            if (Math.abs(top) < 100) {
                pos.leftPos = pos.leftPos > 0 || pos.leftPos < 100 ? pos.leftPos - deltaX * 0.5 : pos.leftPos
            }
        } else {
            pos.topPos =  pos.topPos > 0 || pos.topPos < 100 ? pos.topPos - deltaY * 0.5 : pos.topPos
        }
        return pos;
    }, [left, top]);

    /*   addEventListener for user inout and handle them */
    useEffect(() => {
        const handleUserInput = (e: MouseEvent | TouchEvent) => {
            let clientX = 0,
                clientY = 0;
            if (e instanceof MouseEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e instanceof TouchEvent) {
                if (!!e.touches.length) {
                    clientX = e.touches?.[0].clientX;
                    clientY = e.touches?.[0].clientY;
                }
            }
            if (["touchstart", "mousedown"].indexOf(e.type) > -1) {
                setDefaultTouch({
                    x: clientX,
                    y: clientY,
                    timeStamp: e.timeStamp,
                    mouseState: e.type === "mousedown" ? "DOWN" : "UP",
                });
                setScrollOpacity(1);
            } else if (["touchmove", "mousemove"].indexOf(e.type) > -1) {
                if (
                    !defaultTouch ||
                    (e?.type === "mousemove" && defaultTouch?.mouseState !== "DOWN")
                )
                    return;
                const deltaX = defaultTouch?.x - clientX;
                const deltaY = defaultTouch?.y - clientY;
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    const {leftPos,topPos} = setDirection(deltaX, deltaY);
                    setTop(topPos);
                    setLeft(leftPos);
                    setDefaultTouch({
                        x: clientX,
                        y: clientY,
                        timeStamp: e.timeStamp,
                        mouseState: "DOWN",
                    });
                }
            } else if (["touchend", "mouseup"].indexOf(e.type) > -1) {
                /* total width = 100
                          half swipe = 50
                          n = 50
                        */
                const n = 50;
                if (Math.abs(left) < n) setLeft(0);
                else if (Math.abs(left) > n && Math.abs(left) < 3 * n) setLeft(-2 * n);
                else if (Math.abs(left) > 3 * n) setLeft(-4 * n);

                if (Math.abs(top) < n) setTop(0);
                else if (Math.abs(top) > n && Math.abs(top) < 3 * n) setTop(-2 * n);
                else if (Math.abs(top) > 3 * n && Math.abs(top) < 4 * n) setTop(-4 * n);
                else if (Math.abs(top) > 4 * n) setTop(-4 * n);

                setDefaultTouch({
                    x: 0,
                    y: 0,
                    timeStamp: 0,
                    mouseState: "UP",
                });
                setScrollOpacity(0.2);
            }
        };
        const container = document.getElementsByClassName(
            "container"
        )[0] as HTMLDivElement;
        container.addEventListener("touchstart", handleUserInput);
        container.addEventListener("touchmove", handleUserInput);
        container.addEventListener("touchend", handleUserInput);
        container.addEventListener("mousedown", handleUserInput);
        container.addEventListener("mousemove", handleUserInput);
        container.addEventListener("mouseup", handleUserInput);
        return () => {
            container.removeEventListener("touchstart", handleUserInput);
            container.removeEventListener("touchmove", handleUserInput);
            container.removeEventListener("touchend", handleUserInput);
            container.removeEventListener("mousedown", handleUserInput);
            container.removeEventListener("mousemove", handleUserInput);
            container.removeEventListener("mouseup", handleUserInput);
        };
    });

    /*   watch specific code STARTS */

    const getWeather = () => {
        return weather?.available ? (
            <div className="weather-cont">
                <div className="temp">
                    {Math.round(weather?.currentWeather.temperature || 0)}&#176;C
                    {getWeatherIcon()}
                </div>
                <div className="weather-code">
                    {
                        weatherCodeMap.find(
                            (f) => f.key === weather?.currentWeather.weatherCode
                        )?.val
                    }
                </div>
            </div>
        ) : null;
    };

    const getDate = (mode: "ANALOG" | "DIGITAL") => {
        const _day = mode === "ANALOG" ? days[now.day].slice(0, 2) : days[now.day];
        return (
            <div className="day-cont">
                <div className="date">{now.date}</div>
                <div className="day">{_day}</div>
            </div>
        );
    };

    const updateTheme = () => {
        setThemeIdx((themeIdx) =>
            themeIdx === theme.length - 1 ? 0 : themeIdx + 1
        );
    };

    const getIconv2 = (key = 0, su = 6, sd = 6) => {
        return <img src={`icons/${getWeatherIconString(key, su, sd)}.png`} alt='weather icon'></img>;
    }

    const getWeatherIcon = () => {
        return (
            <span className="weather-icon">
                &nbsp;
                {getIconv2(
                    weatherCodeMap.find(
                        (f) => f.key === weather?.currentWeather.weatherCode
                    )?.key,
                    weather?.currentWeather.sunrise?.getHours(),
                    weather?.currentWeather.sunset?.getHours()
                )}
            </span>
        );
    };

    const toggleAstroMode = () => {
        setAstroMode(prev => prev === 2 ? 0 : prev + 1);
    }

    /*   watch specific code ENDS */

    const backdropBlur =
        top > 0 ? 0 : Math.abs(top) < 100 ? 0.1 * Math.abs(top) : 10;
    return (
        <div className={`page-container astro_${astroMode}`}>
            <div className="container watch-outline">
                <div className="inner-container">
                    <div className="x-scroll" style={{ left: `${left}%` }}>
                        <div className="x-scroll-wrapper">
                            <div className="screen one">
                                <Analog themeIdx={themeIdx} getWeather={getWeather} getDate={getDate} />
                            </div>
                            <div className="screen two">
                                <Digital themeIdx={themeIdx} getWeather={getWeather} getDate={getDate} />
                            </div>
                            <div className="screen three">
                                <Calendar themeIdx={themeIdx} left={left} />
                            </div>
                        </div>
                    </div>
                    <div className="y-scroll" style={{ top: `${top}%` }}>
                        <div
                            className="y-scroll-wrapper"
                            style={{
                                backdropFilter: `blur(${backdropBlur}px)`,
                                WebkitBackdropFilter: `blur(${backdropBlur}px)`,
                            }}
                        >
                            <div className="screen"></div>
                            <div className="screen four">
                                {weather ?<HourlyWeather
                                    weatherIcon={getWeatherIcon()}
                                /> : null}
                            </div>
                            <div className="screen five">
                                {weather ? <DailyWeather
                                    weatherIcon={getWeatherIcon()}
                                /> : null}
                            </div>
                        </div>
                    </div>
                    <div
                        className="x-dot"
                        style={{
                            opacity: scrollOpacity,
                        }}
                    >
                        {
                            dots.map(dot => {
                                return <Dots top={top} left={left} axis='x' idx={dot.idx} key={'x-' + dot.idx} />
                            })
                        }
                    </div>
                    <div
                        className="y-dot"
                        style={{
                            opacity: scrollOpacity,
                        }}
                    >
                        {
                            dots.map(dot => {
                                return <Dots top={top} left={left} axis='y' idx={dot.idx} key={'y-' + dot.idx} />
                            })
                        }
                    </div>
                </div>
                <div className="dial one" onClick={updateTheme}></div>
                <div className="dial two" onClick={toggleAstroMode}></div>
            </div>
        </div>
    );
}
