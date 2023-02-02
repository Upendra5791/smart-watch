import * as React from "react";
import { Calendar } from "./calendar/Calendar";
import { DailyWeather } from "./daily-weather/DailyWeather";
import { HourlyWeather } from "./hourly-weather/HourlyWeather";
import {
    days,
    getWeatherDetails,
    getWeatherIconString,
    HandTransition,
    Now,
    RotationDegrees,
    theme,
    Weather,
    weatherCodeMap,
} from "./watch-utility";
import './watch.css';

interface Touch {
    x: number;
    y: number;
    timeStamp: number;
    mouseState: "UP" | "DOWN";
}

export function Watch() {
    /* _________________________ layout ___________________________  */
    const [defaultTouch, setDefaultTouch] = React.useState<Touch>();
    const [left, setLeft] = React.useState<number>(0);
    const [top, setTop] = React.useState<number>(0);
    const [screen, setScreen] = React.useState({ x: 1, y: 1 });
    const [scrollOpacity, setScrollOpacity] = React.useState(0.2);
    /* _________________________ layout ___________________________  */

    const [rotationDegrees, setRotationDegrees] = React.useState<RotationDegrees>(
        {
            secRotateDeg: 0,
            minRotateDeg: 0,
            hourRotateDeg: 0,
        }
    );
    const [handTransition, setHandTransition] = React.useState<HandTransition>({
        secHand: "none",
        minHand: "none",
        hourHand: "none",
    });
    const [now, setNow] = React.useState<Now>({
        day: 0,
        date: 0,
        hour: 0,
        min: 0,
        sec: 0,
    });

    const [themeIdx, setThemeIdx] = React.useState(0);
    const [weather, setWeather] = React.useState<Weather>();
    const [moonRev, setMoonRev] = React.useState(0);
    const [moonRot, setMoonRot] = React.useState(0);
    const [astroMode, setAstroMode] = React.useState<number>(0);

    /*  Handle screen swipes in x and y direction */
    const setDirection = (deltaX: number, deltaY: number) => {
        if (left > 20) {
            setLeft(0);
            return;
        }
        if (left < -220) {
            setLeft(-200);
            return;
        }
        if (top > 20) {
            setTop(0);
            return;
        }
        if (Math.abs(top) > 200 && Math.abs(top) < 250) {
            setTop(-200);
            return;
        }
        // console.log(top);
        if (Math.abs(deltaX) > Math.abs(deltaY) && top !== 0) {
            if (Math.abs(top) < 100) {
                setLeft((prevVal) =>
                    prevVal > 0 || prevVal < 100 ? prevVal - deltaX * 0.5 : prevVal
                );
            }
        } else {
            setTop((prevVal) =>
                prevVal > 0 || prevVal < 100 ? prevVal - deltaY * 0.5 : prevVal
            );
        }
    };

    /*   addEventListener for user inout and handle them */
    React.useEffect(() => {
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
                // console.log(deltaX, deltaY);
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    setDirection(deltaX, deltaY);
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

    /*  determine the dot position based on current screen display */
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

    const getDots = (axis: "x" | "y", idx: number) => {
        let classlist = ["dot"];
        if (
            (axis === "x" && idx === screen.x) ||
            (axis === "y" && idx === screen.y)
        )
            classlist.push("filled");
        return <span className={classlist.join(" ")}></span>;
    };

    /*   watch specific code STARTS */

    React.useEffect(() => {
        const interval = setInterval(() => {
            const dt = new Date();
            let [sec, min, hour, date, day] = [
                dt.getSeconds(),
                dt.getMinutes(),
                dt.getHours(),
                dt.getDate(),
                dt.getDay(),
            ];
            hour = hour % 12 || 12;
            setRotationDegrees({
                secRotateDeg: sec * (360 / 60),
                minRotateDeg: min * (360 / 60),
                hourRotateDeg: hour * 30 + min * 0.5,
            });
            setNow({
                day: day,
                date: date,
                sec: sec,
                min: min,
                hour: hour,
            });
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    React.useEffect(() => {
        setHandTransition({
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
        });
        setMoonRev(rotationDegrees.minRotateDeg);
        setMoonRot(rotationDegrees.minRotateDeg);
    }, [rotationDegrees]);

    React.useEffect(() => {
        const fetchWeatherData = (coords: GeolocationCoordinates) => {
            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
            )
                /* fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=52.68&longitude=-2.45&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                      ) */
                .then((res) => res.json())
                .then(
                    (result) => (!!result ? setWeather(getWeatherDetails(result)) : null),
                    (error) => console.log("error", error)
                );
        };

        const initializeWeather = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (position?.coords) fetchWeatherData(position.coords);
                    },
                    (error) => {
                        console.error("Error Code = " + error.code + " - " + error.message);
                    }
                );
            } else {
                console.log("Geo Location Not Available");
            }
        };
        initializeWeather();
    }, [now.min]);

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

    const getAnalogWatch = () => {
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
    };

    const getDigitalWatch = () => {
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
    };

    const updateTheme = () => {
        // setThemeIdx(Math.floor(Math.random() * 10));
        setThemeIdx((themeIdx) =>
            themeIdx === theme.length - 1 ? 0 : themeIdx + 1
        );
    };

/*     const getIcon = (key = 0) => {
        switch (key) {
            case 0:
                return <React.Fragment>&#x263C;</React.Fragment>;
            case 1:
                return <React.Fragment>&#x2600;</React.Fragment>;
            case 2:
                return <React.Fragment>&#x26C5;</React.Fragment>;
            case 3:
                return <React.Fragment>&#x2601;</React.Fragment>;
            case 45:
            case 48:
                return <React.Fragment>&#x1F301;</React.Fragment>;
            case 51:
            case 53:
            case 56:
                return <React.Fragment>&#x1F327;</React.Fragment>;
            case 55:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
                return <React.Fragment>&#x2614;</React.Fragment>;
            case 71:
            case 73:
            case 77:
            case 85:
            case 86:
                return <React.Fragment>&#x26C4;</React.Fragment>;
            case 75:
                return <React.Fragment>&#x2603;</React.Fragment>;
            default:
                return <React.Fragment>&#x263C;;</React.Fragment>;
        }
    }; */

    const getIconv2 = (key = 0, su = 6, sd = 6) => {
        return <img src={`icons/${getWeatherIconString(key,su,sd)}.png`} alt='weather icon'></img>;
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
                        <div className="screen one">{getAnalogWatch()}</div>
                        <div className="screen two">{getDigitalWatch()}</div>
                        <div className="screen three">
                            <Calendar themeIdx={themeIdx} left={left}/>
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
                                {!!weather ? <HourlyWeather
                                    weatherDetails={weather}
                                    weatherIcon={getWeatherIcon()}
                                /> : null}
                            </div>
                            <div className="screen five">
                                {!!weather ? <DailyWeather
                                    weatherDetails={weather}
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
                        {getDots("x", 1)}
                        {getDots("x", 2)}
                        {getDots("x", 3)}
                    </div>
                    <div
                        className="y-dot"
                        style={{
                            opacity: scrollOpacity,
                        }}
                    >
                        {getDots("y", 1)}
                        {getDots("y", 2)}
                        {getDots("y", 3)}
                    </div>
                </div>
                <div className="dial one" onClick={updateTheme}></div>
                <div className="dial two" onClick={toggleAstroMode}></div>
            </div>

           {/*  <div className="button-container">
                <div className="btn-cont">
                    <button
                        className="change-theme"
                        style={{
                            backgroundColor:
                                themeIdx === theme.length - 1
                                    ? theme[themeIdx]
                                    : theme[themeIdx + 1],
                        }}
                        onClick={updateTheme}
                    >
                        Change Theme
                    </button>
                </div>
                <div className="btn-cont">
                    <button
                        className="change-theme"
                        style={{
                            backgroundColor:
                                themeIdx === theme.length - 1
                                    ? theme[themeIdx]
                                    : theme[themeIdx + 1],
                        }}
                        onClick={toggleAstroMode}
                    >
                       Toggle Astro Mode
                    </button>
                </div>
            </div> */}
           {/*  <div className="overlay-screen">
                <div className="close-icon">X</div>
            </div> */}
        </div>
    );
}
