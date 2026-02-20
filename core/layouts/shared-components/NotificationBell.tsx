'use client'
import {
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    Fade,
    IconButton,
    List,
    ListItem,
    Paper,
    Popper,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useEffect, useRef, useState } from 'react'
import Icon from '~/core/components/icon'
import { AppNotification, NotificationSeverity, useNotification } from '~/core/contexts/notification'

// ─── Severity Config ──────────────────────────────────────────────────────────

const severityConfig: Record<
    NotificationSeverity,
    { icon: string; color: string; chipColor: 'error' | 'warning' | 'info' | 'success'; label: string }
> = {
    error: { icon: 'mdi:alert-circle', color: '#ef4444', chipColor: 'error', label: 'Error' },
    warning: { icon: 'mdi:alert', color: '#f59e0b', chipColor: 'warning', label: 'Peringatan' },
    info: { icon: 'mdi:information', color: '#3b82f6', chipColor: 'info', label: 'Info' },
    success: { icon: 'mdi:check-circle', color: '#22c55e', chipColor: 'success', label: 'Sukses' },
}

// ─── Seed helper: called once on mount ────────────────────────────────────────

const DEMO_SEEDED_KEY = 'notif_demo_seeded_v2'

function seedDemoNotifications(push: ReturnType<typeof useNotification>['push']) {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(DEMO_SEEDED_KEY)) return
    sessionStorage.setItem(DEMO_SEEDED_KEY, '1')

    push({
        title: 'Produk Kosong: Product E',
        message: 'Product E (SKU-005) stok = 0. Segera lakukan restock untuk mencegah kehilangan penjualan.',
        severity: 'error',
        category: 'umum',
        meta: 'Produk • SKU-005',
    })
    push({
        title: 'Stok Menipis: Product C',
        message: 'Product C (SKU-003) tersisa 40 unit — di bawah batas aman 50 unit.',
        severity: 'warning',
        category: 'umum',
        meta: 'Produk • SKU-003',
    })
    push({
        title: 'Device Offline: Shelfino-03',
        message: 'Perangkat Shelfino-03 (SN-20240003) tidak merespons sejak 14:20. Periksa koneksi atau daya perangkat.',
        severity: 'error',
        category: 'khusus',
        meta: 'Device • SN-20240003',
    })
    push({
        title: 'Device Online: Shelfino-01',
        message: 'Perangkat Shelfino-01 (SN-20240001) kembali online pada 14:22.',
        severity: 'success',
        category: 'khusus',
        meta: 'Device • SN-20240001',
    })
    push({
        title: 'User Login: admin@shelfino.id',
        message: 'Administrator masuk ke sistem (admin@shelfino.id) dari IP 192.168.1.5.',
        severity: 'info',
        category: 'khusus',
        meta: 'Role: Admin • Online',
    })
    push({
        title: 'User Logout: operator1@shelfino.id',
        message: 'Operator operator1@shelfino.id telah keluar dari sistem.',
        severity: 'info',
        category: 'khusus',
        meta: 'Role: Operator • Offline',
    })
    push({
        title: 'Akses Ditolak',
        message: 'User viewer2@shelfino.id mencoba mengakses halaman Device Management yang tidak diizinkan.',
        severity: 'warning',
        category: 'khusus',
        meta: 'Role: Viewer • Akses Ditolak',
    })
}

// ─── Individual Notification Item ─────────────────────────────────────────────

function NotifItem({ notif, onRead, onClear }: { notif: AppNotification; onRead: () => void; onClear: () => void }) {
    const cfg = severityConfig[notif.severity]
    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                py: 1.5,
                px: 2,
                borderLeft: `3px solid ${cfg.color}`,
                bgcolor: notif.read ? 'transparent' : 'action.hover',
                transition: 'background-color .2s',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.selected' },
            }}
            onClick={onRead}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 1.5 }}>
                <Icon icon={cfg.icon} fontSize={20} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                            {notif.title}
                        </Typography>
                        {!notif.read && (
                            <Box
                                sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    bgcolor: cfg.color,
                                    flexShrink: 0,
                                }}
                            />
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, whiteSpace: 'pre-line', fontSize: 12 }}>
                        {notif.message}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                            <Chip label={cfg.label} color={cfg.chipColor} size="small" sx={{ height: 18, fontSize: 10 }} />
                            {notif.meta && (
                                <Typography variant="caption" color="text.disabled" noWrap>
                                    {notif.meta}
                                </Typography>
                            )}
                            <Typography variant="caption" color="text.disabled">
                                • {formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: idLocale })}
                            </Typography>
                        </Box>
                        <Tooltip title="Hapus">
                            <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); onClear() }}
                                sx={{ ml: 'auto', p: 0.25 }}
                            >
                                <Icon icon="mdi:close" fontSize={14} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </ListItem>
    )
}

// ─── Main NotificationBell ────────────────────────────────────────────────────

export default function NotificationBell() {
    const theme = useTheme()
    const { notifications, unreadCount, push, markRead, markAllRead, clear, clearAll } = useNotification()
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const bellRef = useRef<HTMLButtonElement>(null)

    // ── Seed demo notifications once ──────────────────────────────────────────
    useEffect(() => {
        seedDemoNotifications(push)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Shake the bell when a new unread notification arrives ─────────────────
    const [shake, setShake] = useState(false)
    const prevUnread = useRef(unreadCount)
    useEffect(() => {
        if (unreadCount > prevUnread.current) {
            setShake(true)
            const t = setTimeout(() => setShake(false), 700)
            return () => clearTimeout(t)
        }
        prevUnread.current = unreadCount
    }, [unreadCount])

    // ── Close on outside click ────────────────────────────────────────────────
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                const popperEl = document.getElementById('notification-popper')
                if (popperEl && popperEl.contains(e.target as Node)) return
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget)
        setOpen((prev) => !prev)
    }

    // ── Bell icon color based on highest severity ──────────────────────────────
    const bellColor = (() => {
        if (notifications.some((n) => !n.read && n.severity === 'error')) return theme.palette.error.main
        if (notifications.some((n) => !n.read && n.severity === 'warning')) return theme.palette.warning.main
        if (notifications.some((n) => !n.read && n.severity === 'info')) return theme.palette.info.main
        if (notifications.some((n) => !n.read && n.severity === 'success')) return theme.palette.success.main
        return 'inherit'
    })()

    const badgeColor = notifications.some((n) => !n.read && n.severity === 'error')
        ? 'error'
        : notifications.some((n) => !n.read && n.severity === 'warning')
            ? 'warning'
            : 'primary'

    return (
        <>
            <style>{`
                @keyframes bellShake {
                    0%,100%{transform:rotate(0)}
                    15%{transform:rotate(-20deg)}
                    30%{transform:rotate(20deg)}
                    45%{transform:rotate(-15deg)}
                    60%{transform:rotate(15deg)}
                    75%{transform:rotate(-5deg)}
                }
                .bell-shake { animation: bellShake 0.7s ease; }
            `}</style>

            <Tooltip title={`Notifikasi${unreadCount > 0 ? ` (${unreadCount} belum dibaca)` : ''}`}>
                <IconButton
                    ref={bellRef}
                    color="inherit"
                    onClick={handleToggle}
                    aria-label="notifications"
                    sx={{ color: unreadCount > 0 ? bellColor : 'inherit' }}
                >
                    <Badge
                        badgeContent={unreadCount}
                        color={badgeColor as 'error' | 'warning' | 'primary'}
                        max={99}
                        sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16, top: 2, right: 2 } }}
                    >
                        <Icon
                            icon={unreadCount > 0 ? 'mdi:bell-badge' : 'mdi:bell-outline'}
                            className={shake ? 'bell-shake' : ''}
                            fontSize={22}
                        />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popper
                id="notification-popper"
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                transition
                style={{ zIndex: 1400 }}
                modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <Paper
                            elevation={8}
                            sx={{
                                width: 380,
                                maxHeight: 520,
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    bgcolor: 'background.paper',
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Icon icon="mdi:bell" fontSize={18} />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Notifikasi
                                    </Typography>
                                    {unreadCount > 0 && (
                                        <Chip
                                            label={unreadCount}
                                            size="small"
                                            color="error"
                                            sx={{ height: 18, fontSize: 10, minWidth: 28 }}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {unreadCount > 0 && (
                                        <Tooltip title="Tandai semua dibaca">
                                            <IconButton size="small" onClick={markAllRead}>
                                                <Icon icon="mdi:check-all" fontSize={18} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {notifications.length > 0 && (
                                        <Tooltip title="Hapus semua">
                                            <IconButton size="small" onClick={clearAll}>
                                                <Icon icon="mdi:delete-sweep" fontSize={18} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Box>

                            {/* Body */}
                            {notifications.length === 0 ? (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 6,
                                        gap: 1.5,
                                        color: 'text.disabled',
                                    }}
                                >
                                    <Icon icon="mdi:bell-off-outline" fontSize={48} />
                                    <Typography variant="body2">Tidak ada notifikasi</Typography>
                                </Box>
                            ) : (
                                <List
                                    disablePadding
                                    sx={{
                                        overflowY: 'auto',
                                        flex: 1,
                                        '& .MuiListItem-root + .MuiListItem-root': {
                                            borderTop: `1px solid ${theme.palette.divider}`,
                                        },
                                    }}
                                >
                                    {notifications.map((n) => (
                                        <NotifItem
                                            key={n.id}
                                            notif={n}
                                            onRead={() => markRead(n.id)}
                                            onClear={() => clear(n.id)}
                                        />
                                    ))}
                                </List>
                            )}

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <>
                                    <Divider />
                                    <Box sx={{ px: 2, py: 1, bgcolor: 'background.paper' }}>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="text"
                                            color="inherit"
                                            startIcon={<Icon icon="mdi:check-all" fontSize={14} />}
                                            onClick={() => { markAllRead(); setOpen(false) }}
                                            sx={{ fontSize: 12 }}
                                        >
                                            Tandai semua sudah dibaca
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    )
}
