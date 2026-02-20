'use client'
import {
    Box,
    Button,
    Card,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import IconifyIcon from '~/core/components/icon'
import { useNotification } from '~/core/contexts/notification'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TransactionData {
    id: string
    transactionId: string
    product: string
    qty: number
    total: number
    createdAt: Date
    location?: string
}

// ─── Real-Time Location Hook ──────────────────────────────────────────────────

interface LocationState {
    label: string
    loading: boolean
    coords: { lat: number; lon: number } | null
}

function useRealTimeLocation(
    push: ReturnType<typeof useNotification>['push']
): LocationState {
    const [state, setState] = useState<LocationState>({
        label: 'Memuat lokasi…',
        loading: true,
        coords: null,
    })

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({ label: 'Geolocation tidak didukung', loading: false, coords: null })
            push({
                title: 'Geolocation Tidak Tersedia',
                message: 'Browser ini tidak mendukung fitur geolocation. Kolom lokasi tidak dapat diisi secara otomatis.',
                severity: 'warning',
                category: 'umum',
            })
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
                        { headers: { 'Accept-Language': 'id' } }
                    )
                    const data = await res.json()
                    const a = data.address ?? {}

                    const parts = [
                        a.village || a.suburb || a.neighbourhood,
                        a.quarter || a.city_district || a.district,
                        a.city || a.town || a.regency || a.county,
                        a.state,
                        a.country,
                    ].filter(Boolean)

                    setState({
                        label: parts.length > 0 ? parts.join(', ') : data.display_name ?? 'Lokasi tidak diketahui',
                        loading: false,
                        coords: { lat, lon },
                    })
                } catch {
                    setState({ label: 'Gagal mendapatkan nama wilayah', loading: false, coords: null })
                    push({
                        title: 'Gagal Reverse Geocoding',
                        message: 'Tidak dapat mengambil nama wilayah dari koordinat GPS. Periksa koneksi internet Anda.',
                        severity: 'error',
                        category: 'umum',
                    })
                }
            },
            (err) => {
                const denied = err.code === 1
                setState({ label: 'Lokasi Berhenti', loading: false, coords: null })
                push({
                    title: denied ? 'Izin Lokasi Ditolak' : 'Gagal Mendapatkan Lokasi',
                    message: denied
                        ? 'Pengguna menolak izin akses lokasi. Aktifkan izin lokasi di pengaturan browser untuk menggunakan fitur ini.'
                        : `Terjadi kesalahan saat mengambil lokasi GPS: ${err.message}`,
                    severity: 'warning',
                    category: 'umum',
                })
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return state
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const baseMockTransactions: Omit<TransactionData, 'location'>[] = [
    { id: '1', transactionId: 'TRX-20240001', product: 'Product A', qty: 2, total: 300000, createdAt: new Date('2024-12-01T08:30:00') },
    { id: '2', transactionId: 'TRX-20240002', product: 'Product B', qty: 5, total: 175000, createdAt: new Date('2024-12-02T10:15:00') },
    { id: '3', transactionId: 'TRX-20240003', product: 'Product D', qty: 10, total: 120000, createdAt: new Date('2024-12-03T14:00:00') },
    { id: '4', transactionId: 'TRX-20240004', product: 'Product A', qty: 1, total: 150000, createdAt: new Date('2024-12-04T09:00:00') },
    { id: '5', transactionId: 'TRX-20240005', product: 'Product C', qty: 1, total: 980000, createdAt: new Date('2024-12-05T16:45:00') },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d: Date) => format(d, 'dd MMM yyyy, HH:mm')
const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

const tableRows = (data: TransactionData[]) =>
    data.map((r) => ({
        'Transaction ID': r.transactionId,
        Product: r.product,
        Qty: r.qty,
        Total: fmtRp(r.total),
        Date: fmtDate(r.createdAt),
        Location: r.location ?? '-',
    }))

// ── Excel export ──────────────────────────────────────────────────────────────
async function exportExcel(data: TransactionData[]) {
    const { utils, writeFile } = await import('xlsx')
    const ws = utils.json_to_sheet(tableRows(data))
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Transactions')
    writeFile(wb, `transactions_${Date.now()}.xlsx`)
}

// ── PDF export ────────────────────────────────────────────────────────────────
async function exportPdf(data: TransactionData[]) {
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(14)
    doc.text('Transaction Management Report', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 14, 22)
    autoTable(doc, {
        startY: 28,
        head: [['Transaction ID', 'Product', 'Qty', 'Total', 'Date', 'Location']],
        body: data.map((r) => [
            r.transactionId,
            r.product,
            r.qty,
            fmtRp(r.total),
            fmtDate(r.createdAt),
            r.location ?? '-',
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
    })
    doc.save(`transactions_${Date.now()}.pdf`)
}

// ── Word export ───────────────────────────────────────────────────────────────
async function exportWord(data: TransactionData[]) {
    const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, HeadingLevel } =
        await import('docx')
    const { saveAs } = await import('file-saver')

    const headers = ['Transaction ID', 'Product', 'Qty', 'Total', 'Date', 'Location']
    const colWidth = Math.floor(100 / headers.length)
    const headerRow = new TableRow({
        children: headers.map(
            (h) =>
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                    width: { size: colWidth, type: WidthType.PERCENTAGE },
                })
        ),
    })
    const dataRows = data.map(
        (r) =>
            new TableRow({
                children: [r.transactionId, r.product, String(r.qty), fmtRp(r.total), fmtDate(r.createdAt), r.location ?? '-'].map(
                    (cell) =>
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun(cell)] })],
                            width: { size: colWidth, type: WidthType.PERCENTAGE },
                        })
                ),
            })
    )

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        text: 'Transaction Management Report',
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`,
                                italics: true,
                                size: 20,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: '' }),
                    new Table({ rows: [headerRow, ...dataRows], width: { size: 100, type: WidthType.PERCENTAGE } }),
                ],
            },
        ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `transactions_${Date.now()}.docx`)
}

// ── Full recap (Excel with summary sheet) ─────────────────────────────────────
async function exportFullRecap(data: TransactionData[]) {
    const { utils, writeFile } = await import('xlsx')

    const ws1 = utils.json_to_sheet(tableRows(data))

    const totalQty = data.reduce((s, r) => s + r.qty, 0)
    const totalValue = data.reduce((s, r) => s + r.total, 0)
    const summary = [
        { Keterangan: 'Total Transaksi', Nilai: data.length },
        { Keterangan: 'Total Qty Terjual', Nilai: totalQty },
        { Keterangan: 'Total Nilai (Rp)', Nilai: totalValue },
        { Keterangan: 'Rata-rata per Trx', Nilai: Math.round(totalValue / (data.length || 1)) },
        { Keterangan: 'Periode', Nilai: `${fmtDate(data[data.length - 1]?.createdAt)} – ${fmtDate(data[0]?.createdAt)}` },
        { Keterangan: 'Lokasi Perangkat', Nilai: data[0]?.location ?? '-' },
    ]
    const ws2 = utils.json_to_sheet(summary)

    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws1, 'Detail Transaksi')
    utils.book_append_sheet(wb, ws2, 'Rekap')
    writeFile(wb, `rekap_transaksi_${Date.now()}.xlsx`)
}

// ─── Location Cell ────────────────────────────────────────────────────────────

function LocationCell({ label, loading }: { label: string; loading: boolean }) {
    if (loading) {
        return (
            <Box display="flex" alignItems="center" gap={0.5}>
                <CircularProgress size={12} />
                <Typography variant="caption" color="text.secondary">
                    Memuat lokasi…
                </Typography>
            </Box>
        )
    }
    return (
        <Tooltip title={label} arrow>
            <Chip
                icon={
                    <IconifyIcon
                        icon="mdi:map-marker"
                        fontSize={14}
                        style={{ color: '#ef4444', marginLeft: 6 }}
                    />
                }
                label={
                    <Typography
                        variant="caption"
                        noWrap
                        sx={{ maxWidth: 220, display: 'block' }}
                    >
                        {label}
                    </Typography>
                }
                size="small"
                variant="outlined"
                sx={{ borderColor: 'divider', maxWidth: 260 }}
            />
        </Tooltip>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const menuOpen = Boolean(anchorEl)

    const { push } = useNotification()
    const location = useRealTimeLocation(push)

    // Inject location into every row
    const transactions: TransactionData[] = baseMockTransactions.map((r) => ({
        ...r,
        location: location.loading ? 'Memuat lokasi…' : location.label,
    }))

    // ── Columns ──────────────────────────────────────────────────────────────
    const columns: GridColDef[] = [
        {
            flex: 0.2, minWidth: 160, field: 'transactionId', headerName: 'Transaction ID',
            renderCell: ({ row }: { row: TransactionData }) => (
                <Typography variant="body2" noWrap>{row.transactionId}</Typography>
            ),
        },
        {
            flex: 0.2, minWidth: 140, field: 'product', headerName: 'Product',
            renderCell: ({ row }: { row: TransactionData }) => <Typography>{row.product}</Typography>,
        },
        {
            flex: 0.1, minWidth: 70, field: 'qty', headerName: 'Qty',
            renderCell: ({ row }: { row: TransactionData }) => <Typography>{row.qty}</Typography>,
        },
        {
            flex: 0.15, minWidth: 130, field: 'total', headerName: 'Total',
            renderCell: ({ row }: { row: TransactionData }) => <Typography>{fmtRp(row.total)}</Typography>,
        },
        {
            flex: 0.2, minWidth: 170, field: 'createdAt', headerName: 'Date',
            renderCell: ({ row }: { row: TransactionData }) => <Typography>{fmtDate(row.createdAt)}</Typography>,
        },
        {
            flex: 0.35, minWidth: 280, field: 'location', headerName: 'Location',
            sortable: false,
            renderCell: () => (
                <LocationCell label={location.label} loading={location.loading} />
            ),
        },
    ]

    const handleExtract = (type: 'excel' | 'pdf' | 'word' | 'recap') => {
        setAnchorEl(null)
        switch (type) {
            case 'excel': exportExcel(transactions); break
            case 'pdf': exportPdf(transactions); break
            case 'word': exportWord(transactions); break
            case 'recap': exportFullRecap(transactions); break
        }
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader
                            title="Transaction Management"
                            action={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    {/* ── Location info chip ── */}
                                    {location.loading ? (
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <CircularProgress size={12} />
                                            <Typography variant="caption" color="text.secondary">
                                                Mendeteksi lokasi…
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Chip
                                            icon={
                                                <IconifyIcon
                                                    icon="mdi:map-marker-check"
                                                    fontSize={14}
                                                    style={{ color: '#22c55e', marginLeft: 6 }}
                                                />
                                            }
                                            label={
                                                <Typography variant="caption" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                                                    {location.label}
                                                    {location.coords && (
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            color="text.disabled"
                                                            sx={{ ml: 0.5 }}
                                                        >
                                                            ({location.coords.lat.toFixed(4)}, {location.coords.lon.toFixed(4)})
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            }
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderColor: 'divider', maxWidth: 280 }}
                                        />
                                    )}

                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                                    {/* ── Extract button ── */}
                                    <Button
                                        variant="contained"
                                        startIcon={<IconifyIcon icon="mdi:download-outline" />}
                                        endIcon={<IconifyIcon icon="mdi:chevron-down" />}
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                    >
                                        Extract
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={menuOpen}
                                        onClose={() => setAnchorEl(null)}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        slotProps={{ paper: { sx: { minWidth: 200, mt: 0.5 } } }}
                                    >
                                        <MenuItem onClick={() => handleExtract('excel')}>
                                            <ListItemIcon>
                                                <IconifyIcon icon="mdi:microsoft-excel" fontSize={20} color="#217346" />
                                            </ListItemIcon>
                                            <ListItemText>Excel (.xlsx)</ListItemText>
                                        </MenuItem>
                                        <MenuItem onClick={() => handleExtract('pdf')}>
                                            <ListItemIcon>
                                                <IconifyIcon icon="mdi:file-pdf-box" fontSize={20} color="#F40F02" />
                                            </ListItemIcon>
                                            <ListItemText>PDF (.pdf)</ListItemText>
                                        </MenuItem>
                                        <MenuItem onClick={() => handleExtract('word')}>
                                            <ListItemIcon>
                                                <IconifyIcon icon="mdi:microsoft-word" fontSize={20} color="#2B579A" />
                                            </ListItemIcon>
                                            <ListItemText>Word (.docx)</ListItemText>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => handleExtract('recap')}>
                                            <ListItemIcon>
                                                <IconifyIcon icon="mdi:table-sync" fontSize={20} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Rekap Semua"
                                                secondary="Excel 2 sheet: detail + rekap"
                                            />
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            }
                        />
                        <Divider />
                        <DataGrid
                            rows={transactions}
                            rowCount={transactions.length}
                            columns={columns}
                            disableColumnFilter
                            rowSelection={false}
                            pageSizeOptions={[10, 25, 50]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={({ page, pageSize }) =>
                                setPaginationModel({ page, pageSize })
                            }
                            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                        />
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}
