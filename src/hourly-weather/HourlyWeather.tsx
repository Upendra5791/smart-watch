import * as React from 'react';
import './hourly-weather.css';
import { Weather } from '../watch-utility';

interface IHourlyWeatherProps {
    weatherDetails: Weather;
    weatherIcon: JSX.Element
}

export function HourlyWeather({ weatherDetails, weatherIcon}: IHourlyWeatherProps) {
  const get12HourTime = (hour: number) => {
    let meridian = 'PM';
    if (hour >= 0 && hour < 11) {
      meridian = 'AM';
    }
    return (
      <React.Fragment>
        <span>{hour % 12 || 12}</span>
        <span className="meridian">{meridian}</span>
      </React.Fragment>
    );
  };

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

  const getHours = () => {
    return weatherDetails?.hourly?.map((hour: any) => {
      return (
        <div key={hour.time} className="hour">
          <div className="time">{get12HourTime(hour.time)}</div>
          <div className="temp">{Math.round(hour.temperature)}&#176;</div>
        </div>
      );
    });
  };

  const getHourMins = (date: Date) => {
    const hr = new Date(date).getHours();
    const hour = hr % 12 || 12;
    let meridian = 'PM';
    if (hr >= 0 && hr < 11) {
      meridian = 'AM';
    }
    return (
      <React.Fragment>
        <span>{hour}:{new Date(date).getMinutes()}</span>
        <span className="meridian">{meridian}</span>
      </React.Fragment>
    );
  }
  return (
    <div className="screen-container hourly-weather">
      {getWeather()}
      <div className="hourly-temp">
        <div className="x-scroll">{getHours()}</div>
      </div>

      <div className='sun-up-down'>
        <div className='sun-up'>
          <img src='icons/sunrise.png' alt='sunrise'/>
          <span className='sun-up-time'> {getHourMins(weatherDetails.currentWeather.sunrise)} </span>
        </div>
        <div className='sun-down'>
          <img src='icons/sundown.png' alt='sundown'/>
          <span className='sun-down-time'>{getHourMins(weatherDetails.currentWeather.sunset)}</span>
        </div>
      </div>
      
    </div>
  );
}
