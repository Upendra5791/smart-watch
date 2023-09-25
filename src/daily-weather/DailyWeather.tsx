import './daily-weather.css';
import { days } from '../watch-utility';
import { WeatherContext } from '../WatchContainer';
import { useContext } from 'react';

interface IDailyWeatherProps {
    weatherIcon: JSX.Element
}

export function DailyWeather({weatherIcon}: IDailyWeatherProps) {
  
  const weather = useContext(WeatherContext);

  const getWeather = () => {
    return weather?.available ? (
      <div className="weather-cont">
        <div className="temp">
          {Math.round(weather?.currentWeather.temperature || 0)}&#176;C
          {weatherIcon}
        </div>
        <div className="min-max">
          H: {Math.round(weather?.currentWeather.max)}&#176;C &nbsp; L:{' '}
          {Math.round(weather?.currentWeather.min)}&#176;C
        </div>
      </div>
    ) : null;
  };

  const getDays = () => {
    return weather?.daily?.map((day: any) => {
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

  return weather ? (
    <div className="screen-container daily-weather">
      {getWeather()}
      <div className="daily-temp">
        <div className="x-scroll">{getDays()}</div>
      </div>
    </div>
  ) : null;
}
