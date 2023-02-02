import * as React from 'react';
import './daily-weather.css';
import { Weather, days } from '../watch-utility';

interface IDailyWeatherProps {
    weatherDetails: Weather;
    weatherIcon: JSX.Element
}

export function DailyWeather({ weatherDetails, weatherIcon }: IDailyWeatherProps) {
  const getWeather = () => {
    return weatherDetails?.available ? (
      <div className="weather-cont">
        <div className="temp">
          {Math.round(weatherDetails?.currentWeather.temperature || 0)}&#176;C
          {weatherIcon}
        </div>
        <div className="min-max">
          H: {Math.round(weatherDetails?.currentWeather.max)}&#176;C &nbsp; L:{' '}
          {Math.round(weatherDetails?.currentWeather.min)}&#176;C
        </div>
      </div>
    ) : null;
  };

  const getDays = () => {
    return weatherDetails?.daily?.map((day: any) => {
      return (
        <div key={day.day.getDate()} className="day">
          <div className="day">{days[day.day.getDay()]}</div>
          <div className="temp">
            H: {Math.round(day.max)}&#176;
            <br />
            L: {Math.round(day.min)}&#176;
          </div>
        </div>
      );
    });
  };

  return (
    <div className="screen-container daily-weather">
      {getWeather()}
      <div className="daily-temp">
        <div className="x-scroll">{getDays()}</div>
      </div>
    </div>
  );
}
