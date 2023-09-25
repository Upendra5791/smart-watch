import { ReactNode, createContext, useEffect, useState } from "react";
import { Now, Weather } from "./watch-utility";
import useWeather from "./hooks/useWeather";


export const NowContext = createContext({
    day: 0,
    date: 0,
    hour: 0,
    min: 0,
    sec: 0,
});

export const WeatherContext = createContext<Weather | undefined>(undefined);

export default function WatchContainer({ children }: { children: ReactNode }) {

    const [now, setNow] = useState<Now>({
        day: 0,
        date: 0,
        hour: 0,
        min: 0,
        sec: 0,
    });
    const weather = useWeather(now?.min);

    useEffect(() => {
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
            setNow({
                day: day,
                date: date,
                sec: sec,
                min: min,
                hour: hour,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NowContext.Provider value={now}>
            <WeatherContext.Provider value={weather}>
                {children}
            </WeatherContext.Provider>
        </NowContext.Provider>
    )
}