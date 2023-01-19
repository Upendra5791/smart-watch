import React from "react";
import './watch.css';
import { Weather, theme, days, weatherCodeMap } from "./watch-utility";


export function Watch() {
    const [secRotateDeg, setSecRotateDeg] = React.useState(0);
    const [minRotateDeg, setMinRotateDeg] = React.useState(0);
    const [hourRotateDeg, setHourRotateDeg] = React.useState(0);
    const [secHandTransition, setSecHandTransition] = React.useState('none');
    const [minHandTransition, setMinHandTransition] = React.useState('none');
    const [hourHandTransition, setHourHandTransition] = React.useState('none');
    const [day, setDay] = React.useState(0);
    const [date, setDate] = React.useState(0);
    const [hour, setHour] = React.useState(0);
    const [min, setMin] = React.useState(0);
    const [themeIdx, setThemeIdx] = React.useState(0);
    const [mode, setMode] = React.useState<'ANALOG' | 'DIGITAL'>('ANALOG');
    const [weather, setWeather] = React.useState<Weather>();

    React.useEffect(() => {
        let interval = setInterval(() => {
            const dt = new Date();
            let [sec, min, hour, date, day] = [
                dt.getSeconds(),
                dt.getMinutes(),
                dt.getHours(),
                dt.getDate(),
                dt.getDay(),
            ];
            hour = hour % 12 || 12;
            setHour(hour);
            setMin(min);
            setSecRotateDeg(sec * (360 / 60));
            setMinRotateDeg(min * (360 / 60));
            setHourRotateDeg(hour * 30 + min * 0.5);
            setDay(day);
            setDate(date);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    React.useEffect(() => {
        secRotateDeg < 6
            ? setSecHandTransition('all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s')
            : setSecHandTransition('all 0.2s cubic-bezier(0, 0, 0.99, 1.02) 0s');
        minRotateDeg < 6
            ? setMinHandTransition('all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s')
            : setMinHandTransition('all 0.2s cubic-bezier(0, 0, 0.99, 1.02) 0s');
        hourRotateDeg < 6
            ? setHourHandTransition('all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s')
            : setHourHandTransition('all 0.2s cubic-bezier(0, 0, 0.99, 1.02) 0s');
    }, [secRotateDeg, minRotateDeg, hourRotateDeg]);

    React.useEffect(() => {
        const fetchWeatherData = (coords: GeolocationCoordinates) => {
            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`,
            )
                .then((res) => {
                    return res.json();
                })
                .then(
                    (result) => {
                        setWeather({
                            available: true,
                            temperature: result?.current_weather?.temperature,
                            weatherCode: result?.current_weather?.weathercode
                        });
                    },
                    (error) => {
                        console.log('error', error);
                    }
                );
        };

        const initializeWeather = () => {
            if ('geolocation' in navigator) {
                console.log('Available');
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log(position?.coords);
                        if (position?.coords) fetchWeatherData(position.coords);
                    },
                    (error) => {
                        console.error('Error Code = ' + error.code + ' - ' + error.message);
                    }
                );
            } else {
                console.log('Not Available');
            }
        };

        initializeWeather();
    }, [min]);

    const updateTheme = () => {
        // setThemeIdx(Math.floor(Math.random() * 10));
        setThemeIdx((themeIdx) =>
            themeIdx === theme.length - 1 ? 0 : themeIdx + 1
        );
    };

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'ANALOG' ? 'DIGITAL' : 'ANALOG'));
    };

    const getWeather = () => {
        return weather?.available ? (
            <div className="weather-cont">
                <div className="temp">{Math.round(weather?.temperature || 0)}&#176;C</div>
                <div className="weather-code">{weatherCodeMap.find(f => f.key === weather?.weatherCode)?.val}</div>
            </div>
        ) : null;
    }

    const getDate = () => {
        const _day = mode === 'ANALOG' ? days[day].slice(0, 2) : days[day];
        return (
            <div className="day-cont">
                <div className="date">{date}</div>
                <div className="day">{_day}</div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="page-container">
                <div className="container">
                    <div
                        className="scroll-wrapper"
                        style={{ left: mode === 'ANALOG' ? 0 : '-100vw' }}
                    >
                        <div className="clock-wrapper analog">
                            <div className="clock-container">
                                <span
                                    className=" number twelve"
                                    style={{ color: theme[themeIdx] }}
                                >
                                    12
                                </span>
                                <span
                                    className="number three"
                                    style={{ color: theme[themeIdx] }}
                                >
                                    3
                                </span>
                                <span className="number six" style={{ color: theme[themeIdx] }}>
                                    6
                                </span>
                                <span
                                    className="number nine"
                                    style={{ color: theme[themeIdx] }}
                                >
                                    9
                                </span>
                                <div className="center"></div>
                                <div
                                    className="seconds-hand hand"
                                    style={{
                                        transform: `rotate(${secRotateDeg}deg)`,
                                        transition: secHandTransition,
                                    }}
                                ></div>
                                <div
                                    className="minute-hand hand"
                                    style={{
                                        transform: `rotate(${minRotateDeg}deg)`,
                                        transition: minHandTransition,
                                    }}
                                ></div>
                                <div
                                    className="hour-hand hand"
                                    style={{
                                        transform: `rotate(${hourRotateDeg}deg)`,
                                        transition: hourHandTransition,
                                    }}
                                ></div>
                                {getWeather()}
                                {getDate()}
                            </div>
                        </div>
                        <div className="clock-wrapper digital">
                            <div className="clock-container">
                                <div className="hour number" style={{ color: theme[themeIdx] }}>
                                    <span>{hour}</span>
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
                                    <span>{min}</span>
                                </div>
                                {getWeather()}
                                {getDate()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <div className="btn-cont">
                        <input
                            type="checkbox"
                            value="show digital"
                            onClick={toggleMode}
                            checked={mode === 'DIGITAL'}
                            readOnly
                        />
                        <div className="toggle-container" onClick={toggleMode}>
                            <div
                                className="tgbt"
                                style={{
                                    backgroundColor:
                                        themeIdx === theme.length - 1
                                            ? theme[themeIdx]
                                            : theme[themeIdx + 1],
                                }}
                            ></div>
                        </div>
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
                            onClick={updateTheme}
                        >
                            Change Theme
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
