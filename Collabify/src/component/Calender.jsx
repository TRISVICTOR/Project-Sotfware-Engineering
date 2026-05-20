import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar({ tasks = [] }) {
  const navigate = useNavigate();
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

  // Cari task yang deadline di tanggal tertentu
  const getTaskOnDate = (d) => {
    return tasks.find(task => {
      const deadline = new Date(task.deadline);
      return deadline.getDate() === d &&
             deadline.getMonth() === month &&
             deadline.getFullYear() === year;
    });
  };

  const formatTime = () => {
    let h = time.getHours();
    const m = String(time.getMinutes()).padStart(2, "0");
    h = h % 12 || 12;
    return `${h}:${m}`;
  };

  const getDayClass = (d) => {
    const task = getTaskOnDate(d);
    let cls = "day";
    if (isToday(d)) cls += " today";
    if (isSelected(d)) cls += " selected";
    if (task) {
      cls += task.tipe === 'group' ? " task-group" : " task-personal";
    }
    return cls;
  };

  const handleDayClick = (d) => {
    setSelectedDate(new Date(year, month, d));
    const task = getTaskOnDate(d);
    // Kalau task group dan punya group_id → arahkan ke group project
    if (task && task.tipe === 'group' && task.group_id) {
      navigate('/groupproject', { state: { groupId: task.group_id } });
    }
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
          const task = getTaskOnDate(d);
          return (
            <div
              key={d}
              className={getDayClass(d)}
              onClick={() => handleDayClick(d)}
              title={task ? `${task.judul} (${task.tipe})` : ''}
              style={{ cursor: task?.tipe === 'group' ? 'pointer' : 'default' }}
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

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px', justifyContent: 'center', fontSize: '0.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
          <span>Personal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7', display: 'inline-block' }}></span>
          <span>Group</span>
        </div>
      </div>

    </div>
  );
}