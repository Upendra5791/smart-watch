import React from "react";
import { Weather, getWeatherDetails } from "../watch-utility";

export default function useWeather(min: number) {
    const [weather, setWeather] = React.useState<Weather>();
    React.useEffect(() => {
        const fetchWeatherData = (coords: GeolocationCoordinates) => {
            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
            )
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
    }, [min]);
    return weather;
}