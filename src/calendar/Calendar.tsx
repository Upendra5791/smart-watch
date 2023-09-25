import { months, theme, weekDays } from '../watch-utility';
import './calendar.css';

interface ICalendarProps {
  themeIdx: number;
  left: number;
}

export function Calendar({ themeIdx, left }: ICalendarProps) {

  const getHeaderCells = () => {
    return weekDays.map((m, i) => (
      <div key={`header_cell_${m}_${i}`} className="cell">
        {m.slice(0, 1)}
      </div>
    ));
  };

  const getDates = () => {
    const unitDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const daysInThisMonth = [];
    const day = new Date();
    let _day = new Date(day.setDate(1));
    if (_day.getDay() !== 0)
      daysInThisMonth.push(...new Array(6 - _day.getDay()).fill(0));
    while (_day.getMonth() === today.getMonth()) {
      daysInThisMonth.push(_day.getDate());
      _day = new Date(_day.getTime() + unitDay);
    }

    return daysInThisMonth.map((d, i) => {
      let classList = 'cell';
      if (d === today.getDate()) classList += ' today';
      return (
        <div key={`body_cell_${d}_${i}`} className={classList}>
          <span
            style={{
              backgroundColor:
                d === today.getDate()
                  ? themeIdx === theme.length - 1
                    ? theme[themeIdx]
                    : theme[themeIdx + 1]
                  : 'transparent',
            }}
          >
            {d === 0 ? '' : d}
          </span>
        </div>
      );
    });
  };

  const getTitle = () => {
    return (
      <div
        className="title"
        style={{
          color:
            themeIdx === theme.length - 1
              ? theme[themeIdx]
              : theme[themeIdx + 1],
        }}
      >
        {months[new Date().getMonth()]} {new Date().getFullYear()}
      </div>
    );
  };

  const backgroundY = Math.abs(left) > 190 ? 150 : 250

  return (
    <div className="screen-container calendar"
      style={{
        backgroundPositionY: `${(backgroundY)}%`
      }}>
      {getTitle()}
      <div className="calendar-layout">
        <div className="header">{getHeaderCells()}</div>
        <div className="body">{getDates()}</div>
      </div>
    </div>
  );
}
