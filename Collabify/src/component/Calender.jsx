import { useState, useEffect } from "react";
import "../styles/HomePage.css";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [ampm, setAmpm] = useState(today.getHours() >= 12 ? "PM" : "AM");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const prevMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  };

  const nextMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (d) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (d) =>
    d === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  const formatTime = () => {
    let h = time.getHours();
    const m = String(time.getMinutes()).padStart(2, "0");
    h = h % 12 || 12;
    return `${h}:${m}`;
  };

  const getDayClass = (d) => {
    if (isToday(d)) return "day today";
    if (isSelected(d)) return "day selected";
    return "day";
  };

  return (
    <div className="calendar">

      {/* Header */}
      <div className="cal-header">
        <div className="cal-month-label">
          <span className="month-title">
            {MONTHS[month]} {year}
          </span>
          <span className="month-arrow">›</span>
        </div>
        <div className="cal-nav">
          <button onClick={prevMonth}>‹</button>
          <button onClick={nextMonth}>›</button>
        </div>
      </div>

      {/* Grid */}
      <div className="cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="day-label">{d}</div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          return (
            <div
              key={d}
              className={getDayClass(d)}
              onClick={() => setSelectedDate(new Date(year, month, d))}
            >
              {d}
            </div>
          );
        })}
      </div>

      {/* Time */}
      <div className="cal-time">
        <span className="time-label">Time</span>
        <div className="time-right">
          <span className="time-value">{formatTime()}</span>
          <div className="ampm-toggle">
            <button
              className={ampm === "AM" ? "active" : ""}
              onClick={() => setAmpm("AM")}
            >
              AM
            </button>
            <button
              className={ampm === "PM" ? "active" : ""}
              onClick={() => setAmpm("PM")}
            >
              PM
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}