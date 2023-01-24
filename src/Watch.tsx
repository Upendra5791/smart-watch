import './watch.css';
import {
    Weather,
    theme,
    days,
    weatherCodeMap,
    RotationDegrees,
    HandTransition,
    Now,
} from './watch-utility';
import React from 'react';

export function Watch() {
    const [rotationDegrees, setRotationDegrees] = React.useState<RotationDegrees>(
        {
            secRotateDeg: 0,
            minRotateDeg: 0,
            hourRotateDeg: 0,
        }
    );
    const [handTransition, setHandTransition] = React.useState<HandTransition>({
        secHand: 'none',
        minHand: 'none',
        hourHand: 'none',
    });
    const [now, setNow] = React.useState<Now>({
        day: 0,
        date: 0,
        hour: 0,
        min: 0,
        sec: 0,
    });

    const [themeIdx, setThemeIdx] = React.useState(0);
    const [mode, setMode] = React.useState<'ANALOG' | 'DIGITAL'>('ANALOG');
    const [weather, setWeather] = React.useState<Weather>();
    const [x, setX] = React.useState<number>(0);
    const [scrollVal, setScrollVal] = React.useState<number>(0);

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
                    ? 'all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s'
                    : 'all 1s cubic-bezier(0, 0, 0.99, 1.02) 0s',
            minHand:
                rotationDegrees.minRotateDeg < 6
                    ? 'all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s'
                    : 'all 0.2s cubic-bezier(0, 0, 0.99, 1.02) 0s',
            hourHand:
                rotationDegrees.hourRotateDeg < 6
                    ? 'all 0s cubic-bezier(0, 0, 0.99, 1.02) 0s'
                    : 'all 0.2s cubic-bezier(0, 0, 0.99, 1.02) 0s',
        });
    }, [rotationDegrees]);

    React.useEffect(() => {
        const fetchWeatherData = (coords: GeolocationCoordinates) => {
            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
            )
                .then((res) => {
                    return res.json();
                })
                .then(
                    (result) => {
                        setWeather({
                            available: true,
                            temperature: result?.current_weather?.temperature,
                            weatherCode: result?.current_weather?.weathercode,
                        });
                    },
                    (error) => {
                        console.log('error', error);
                    }
                );
        };

        const initializeWeather = () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (position?.coords) fetchWeatherData(position.coords);
                    },
                    (error) => {
                        console.error('Error Code = ' + error.code + ' - ' + error.message);
                    }
                );
            } else {
                console.log('Geo Location Not Available');
            }
        };
        initializeWeather();
    }, [now.min]);

    React.useEffect(() => {
        setScrollVal(mode === 'ANALOG' ? 0 : -100);
    }, [mode]);

    React.useEffect(() => {
        window.addEventListener('touchstart', handleTouchEvent);
        window.addEventListener('touchmove', handleTouchEvent);
        window.addEventListener('touchend', handleTouchEvent);
        window.addEventListener('touchcancel', handleTouchEvent);

        return () => {
            window.removeEventListener('touchstart', handleTouchEvent);
            window.removeEventListener('touchmove', handleTouchEvent);
            window.removeEventListener('touchend', handleTouchEvent);
            window.removeEventListener('touchcancel', handleTouchEvent);
        };
    });

    const handleTouchEvent = (event: TouchEvent) => {
        let touch = event.touches[0] || event.changedTouches[0];
        // check the events
        if (event.type === 'touchstart') {
            setX(touch.pageX);
        } else if (event.type === 'touchmove') {
            let deltaX = touch.pageX - x;
            if (Math.abs(deltaX) > 15) {
                setX(touch.pageX);
                if (deltaX <= 0) {
                    setScrollVal((prevVal) => {
                        return prevVal > -100 ? prevVal + deltaX * 0.65 : prevVal;
                    });
                } else if (deltaX > 0) {
                    setScrollVal((prevVal) => {
                        return prevVal < 0 ? prevVal + deltaX * 0.65 : prevVal;
                    });
                }
            }
        } else if (event.type === 'touchend') {
            setX(0);
            if (scrollVal < -50) setScrollVal(-100);
            else if (scrollVal >= -50) setScrollVal(0);
            setMode((prevVal) => {
                if (scrollVal < -50) return 'DIGITAL';
                else if (scrollVal >= -50) return 'ANALOG';
                else return prevVal;
            });
        }
        return null;
    };

    const updateTheme = () => {
        // setThemeIdx(Math.floor(Math.random() * 10));
        setThemeIdx((themeIdx) =>
            themeIdx === theme.length - 1 ? 0 : themeIdx + 1
        );
    };

    /*   const toggleMode = () => {
      setMode((prevMode) => (prevMode === 'ANALOG' ? 'DIGITAL' : 'ANALOG'));
    }; */

    const getWeather = () => {
        return weather?.available ? (
            <div className="weather-cont">
                <div className="temp">
                    {Math.round(weather?.temperature || 0)}&#176;C
                </div>
                <div className="weather-code">
                    {weatherCodeMap.find((f) => f.key === weather?.weatherCode)?.val}
                </div>
            </div>
        ) : null;
    };

    const getDate = () => {
        const _day = mode === 'ANALOG' ? days[now.day].slice(0, 2) : days[now.day];
        return (
            <div className="day-cont">
                <div className="date">{now.date}</div>
                <div className="day">{_day}</div>
            </div>
        );
    };

    const getAnalogWatch = () => {
        return (
            <div className="clock-wrapper analog">
                <div className="clock-container">
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
                    {getWeather()}
                    {getDate()}
                </div>
            </div>
        );
    };

    const getDigitalWatch = () => {
        return (
            <div className="clock-wrapper digital">
                <div className="clock-container">
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
                    {getDate()}
                </div>
            </div>
        );
    };

    const getDot = (in_mode: 'ANALOG' | 'DIGITAL') => {
        return (
            <span className='dot'
                style={{
                    backgroundColor: in_mode === mode ? 'rgb(202, 202, 202)' : 'transparent'
                }}
                onClick={() => setMode(in_mode)}></span>
        )
    }

    return (
        <React.Fragment>
            <div className="page-container">
                <div className="container">
                    <div
                        className="scroll-wrapper"
                        style={{ left: `${scrollVal}vw` }}
                    >
                        {getAnalogWatch()}
                        {getDigitalWatch()}
                    </div>
                </div>
                <div className="button-container">
                    <div className='btn-cont'>
                        {getDot('ANALOG')}
                        {getDot('DIGITAL')}
                    </div>
                    {/*  <div className="btn-cont">
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
                    </div> */}

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
