import { useState, useEffect, useRef, useCallback } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notificationApi';
import notifSound from './Spirit_-_Blackberry_Stock_Notification-641725-mobiles24.mp3';

function NotificationSound() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevCountRef = useRef(0);
  const audioRef = useRef(new Audio(notifSound));

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const data = await getNotifications();
      setNotifications(data);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);

      // Putar suara kalau ada notif baru
      if (unread > prevCountRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log('Audio blocked:', err));
      }
      prevCountRef.current = unread;
    } catch (err) {
      console.error('Gagal fetch notifikasi:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const getIcon = (tipe) => {
    switch (tipe) {
      case 'deadline_24jam': return '⏰';
      case 'deadline_12jam': return '🚨';
      case 'friend_request': return '👋';
      case 'task_assigned':  return '📋';
      default:               return '🔔';
    }
  };

  const getLabel = (tipe) => {
    switch (tipe) {
      case 'deadline_24jam': return 'Deadline 24 Jam';
      case 'deadline_12jam': return 'Deadline 12 Jam';
      case 'friend_request': return 'Permintaan Teman';
      case 'task_assigned':  return 'Task Baru';
      default:               return 'Notifikasi';
    }
  };

  const formatWaktu = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>

      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative', background: 'none', border: 'none',
          fontSize: '1.5rem', cursor: 'pointer', padding: '6px', borderRadius: '50%'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#ef4444', color: 'white', fontSize: '0.65rem',
            fontWeight: 'bold', minWidth: '18px', height: '18px',
            borderRadius: '999px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '0 4px',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: '320px', background: 'white', borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 1000, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', borderBottom: '1px solid #f0f0f0'
          }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Notifikasi</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} style={{
                background: 'none', border: 'none', color: '#6366f1',
                fontSize: '0.78rem', cursor: 'pointer'
              }}>
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => { if (!notif.is_read) handleMarkAsRead(notif.id); }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: '1px solid #f9f9f9',
                    background: !notif.is_read
                      ? (notif.tipe === 'deadline_12jam' ? '#fee2e2' : '#eef2ff')
                      : 'white',
                    borderLeft: notif.tipe === 'deadline_12jam' ? '3px solid #ef4444' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{getIcon(notif.tipe)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase' }}>
                      {getLabel(notif.tipe)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#374151', margin: '2px 0 4px', lineHeight: 1.4 }}>
                      {notif.pesan}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {formatWaktu(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.is_read && (
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#6366f1', flexShrink: 0, marginTop: '6px'
                    }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay tutup dropdown */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
        />
      )}
    </div>
  );
}

export default NotificationSound;