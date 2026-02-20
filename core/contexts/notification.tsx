'use client'
import { createContext, useCallback, useContext, useState, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationSeverity = 'error' | 'warning' | 'info' | 'success'

/**
 * "umum"   → General notifications (stock alerts, location issues, system info)
 * "khusus" → Special/device notifications (device online/offline, user status)
 */
export type NotificationCategory = 'umum' | 'khusus'

export interface AppNotification {
    id: string
    title: string
    message: string
    severity: NotificationSeverity
    category: NotificationCategory
    timestamp: Date
    read: boolean
    /** Optional small secondary label, e.g. "Device • SN-1234" */
    meta?: string
}

interface NotificationContextValue {
    notifications: AppNotification[]
    unreadCount: number
    unreadUmum: number
    unreadKhusus: number
    push: (payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
    markRead: (id: string) => void
    markAllRead: () => void
    markCategoryRead: (cat: NotificationCategory) => void
    clear: (id: string) => void
    clearAll: () => void
    clearCategory: (cat: NotificationCategory) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>([])

    const push = useCallback(
        (payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
            const newNotif: AppNotification = {
                ...payload,
                id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                timestamp: new Date(),
                read: false,
            }
            setNotifications((prev) => [newNotif, ...prev])
        },
        []
    )

    const markRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }, [])

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }, [])

    const markCategoryRead = useCallback((cat: NotificationCategory) => {
        setNotifications((prev) =>
            prev.map((n) => (n.category === cat ? { ...n, read: true } : n))
        )
    }, [])

    const clear = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const clearAll = useCallback(() => setNotifications([]), [])

    const clearCategory = useCallback((cat: NotificationCategory) => {
        setNotifications((prev) => prev.filter((n) => n.category !== cat))
    }, [])

    const unreadCount = notifications.filter((n) => !n.read).length
    const unreadUmum = notifications.filter((n) => !n.read && n.category === 'umum').length
    const unreadKhusus = notifications.filter((n) => !n.read && n.category === 'khusus').length

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                unreadUmum,
                unreadKhusus,
                push,
                markRead,
                markAllRead,
                markCategoryRead,
                clear,
                clearAll,
                clearCategory,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotification(): NotificationContextValue {
    const ctx = useContext(NotificationContext)
    if (!ctx) throw new Error('useNotification must be used inside <NotificationProvider>')
    return ctx
}
