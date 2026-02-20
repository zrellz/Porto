'use client'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import IconifyIcon from '~/core/components/icon'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductData {
    id: string
    name: string
    sku: string
    category: string
    price: number
    stock: number
    status: 'active' | 'inactive'
    image?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Electronics', 'Accessories', 'Food & Beverage', 'Other']

const INITIAL_PRODUCTS: ProductData[] = [
    { id: '1', name: 'Product A', sku: 'SKU-001', category: 'Electronics', price: 150000, stock: 120, status: 'active' },
    { id: '2', name: 'Product B', sku: 'SKU-002', category: 'Accessories', price: 35000, stock: 250, status: 'active' },
    { id: '3', name: 'Product C', sku: 'SKU-003', category: 'Electronics', price: 980000, stock: 40, status: 'inactive' },
    { id: '4', name: 'Product D', sku: 'SKU-004', category: 'Food & Beverage', price: 12000, stock: 500, status: 'active' },
    { id: '5', name: 'Product E', sku: 'SKU-005', category: 'Other', price: 75000, stock: 0, status: 'inactive' },
]

// ─── Product Form Dialog ──────────────────────────────────────────────────────

interface ProductFormDialogProps {
    open: boolean
    initial?: ProductData | null
    onClose: () => void
    onSubmit: (data: Omit<ProductData, 'id'>) => void
}

function ProductFormDialog({ open, initial, onClose, onSubmit }: ProductFormDialogProps) {
    const isEdit = !!initial
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState('')
    const [sku, setSku] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)

    // Reset / sync whenever dialog opens
    const handleEnter = () => {
        setName(initial?.name ?? '')
        setSku(initial?.sku ?? '')
        setCategory(initial?.category ?? '')
        setPrice(initial ? String(initial.price) : '')
        setStock(initial ? String(initial.stock) : '')
        setImagePreview(initial?.image)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file')
            return
        }
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const isValid = name.trim() && sku.trim() && category && Number(price) > 0 && Number(stock) >= 0

    const handleSubmit = () => {
        if (!isValid) {
            toast.error('Please fill in all fields correctly')
            return
        }
        onSubmit({
            name: name.trim(),
            sku: sku.trim(),
            category,
            price: Number(price),
            stock: Number(stock),
            status: initial?.status ?? 'active',
            image: imagePreview,
        })
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth TransitionProps={{ onEnter: handleEnter }}>
            <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>

                    {/* ── Photo Upload area ── */}
                    <Grid size={12}>
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                border: '2px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'border-color 0.2s, background 0.2s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                            }}
                        >
                            {imagePreview ? (
                                <>
                                    <Avatar
                                        src={imagePreview}
                                        variant="rounded"
                                        sx={{ width: 100, height: 100 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Click to change photo
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <IconifyIcon icon="mdi:image-plus-outline" fontSize={40} color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        Click to upload product photo
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        PNG, JPG, WEBP supported
                                    </Typography>
                                </>
                            )}
                        </Box>
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            aria-label="Upload product photo"
                            title="Upload product photo"
                            onChange={handleImageChange}
                            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, overflow: 'hidden' }}
                        />
                    </Grid>

                    {/* ── Text Fields ── */}
                    <Grid size={12}>
                        <TextField
                            fullWidth required label="Product Name"
                            value={name} onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name..."
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth required label="SKU"
                            value={sku} onChange={(e) => setSku(e.target.value)}
                            placeholder="e.g. SKU-006"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            select fullWidth required label="Category"
                            value={category} onChange={(e) => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth required label="Price (Rp)" type="number"
                            value={price} onChange={(e) => setPrice(e.target.value)}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth required label="Stock" type="number"
                            value={stock} onChange={(e) => setStock(e.target.value)}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
                    {isEdit ? 'Save Changes' : 'Add Product'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

interface DeleteProductDialogProps {
    open: boolean
    product: ProductData | null
    onClose: () => void
    onConfirm: (id: string) => void
}

function DeleteProductDialog({ open, product, onClose, onConfirm }: DeleteProductDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete <strong>{product?.name}</strong>? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="error" onClick={() => product && onConfirm(product.id)}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
    const [products, setProducts] = useState<ProductData[]>(INITIAL_PRODUCTS)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [openCreate, setOpenCreate] = useState(false)
    const [editTarget, setEditTarget] = useState<ProductData | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<ProductData | null>(null)

    // ── Filters ──────────────────────────────────────────────────────────────
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
    const [filterCategory, setFilterCategory] = useState<string>('all')

    const filteredProducts = products.filter((p) => {
        const matchStatus = filterStatus === 'all' || p.status === filterStatus
        const matchCategory = filterCategory === 'all' || p.category === filterCategory
        return matchStatus && matchCategory
    })

    const handleCreate = (data: Omit<ProductData, 'id'>) => {
        setProducts((prev) => [{ ...data, id: String(Date.now()) }, ...prev])
        toast.success(`${data.name} added successfully`)
        setOpenCreate(false)
    }

    const handleEdit = (data: Omit<ProductData, 'id'>) => {
        setProducts((prev) => prev.map((p) => (p.id === editTarget!.id ? { ...data, id: p.id } : p)))
        toast.success(`${data.name} updated successfully`)
        setEditTarget(null)
    }

    const handleDelete = (id: string) => {
        const name = products.find((p) => p.id === id)?.name
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success(`${name} deleted successfully`)
        setDeleteTarget(null)
    }

    const handleToggleStatus = (id: string) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p
                const next = p.status === 'active' ? 'inactive' : 'active'
                toast.success(`${p.name} set to ${next}`)
                return { ...p, status: next }
            })
        )
    }

    const columns: GridColDef[] = [
        {
            flex: 0.07,
            minWidth: 60,
            field: 'image',
            headerName: 'Photo',
            sortable: false,
            renderCell: ({ row }: { row: ProductData }) => (
                <Avatar src={row.image} variant="rounded" sx={{ width: 36, height: 36, my: 0.5 }}>
                    <IconifyIcon icon="mdi:package-variant" fontSize={20} />
                </Avatar>
            ),
        },
        {
            flex: 0.22,
            minWidth: 180,
            field: 'name',
            headerName: 'Product',
            renderCell: ({ row }: { row: ProductData }) => (
                <div>
                    <Typography variant="body1" noWrap>{row.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>{row.sku}</Typography>
                </div>
            ),
        },
        {
            flex: 0.17,
            minWidth: 130,
            field: 'category',
            headerName: 'Category',
            renderCell: ({ row }: { row: ProductData }) => <Typography>{row.category}</Typography>,
        },
        {
            flex: 0.15,
            minWidth: 130,
            field: 'price',
            headerName: 'Price',
            renderCell: ({ row }: { row: ProductData }) => (
                <Typography>Rp {row.price.toLocaleString('id-ID')}</Typography>
            ),
        },
        {
            flex: 0.08,
            minWidth: 70,
            field: 'stock',
            headerName: 'Stock',
            renderCell: ({ row }: { row: ProductData }) => <Typography>{row.stock}</Typography>,
        },
        {
            flex: 0.17,
            minWidth: 150,
            field: 'status',
            headerName: 'Status',
            renderCell: ({ row }: { row: ProductData }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={row.status === 'active' ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}>
                        <Switch
                            size="small"
                            checked={row.status === 'active'}
                            onChange={() => handleToggleStatus(row.id)}
                            color="success"
                        />
                    </Tooltip>
                    <Chip
                        label={row.status}
                        color={row.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                    />
                </Box>
            ),
        },
        {
            flex: 0.12,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }: { row: ProductData }) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => setEditTarget(row)}>
                            <IconifyIcon icon="mdi:pencil-outline" fontSize={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
                            <IconifyIcon icon="mdi:trash-can-outline" fontSize={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ]

    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader
                            title="Product Management"
                            action={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    {/* ── Status filter ── */}
                                    {(['all', 'active', 'inactive'] as const).map((s) => (
                                        <Button
                                            key={s}
                                            size="small"
                                            variant={filterStatus === s ? 'contained' : 'outlined'}
                                            onClick={() => {
                                                setFilterStatus(s)
                                                setPaginationModel((m) => ({ ...m, page: 0 }))
                                            }}
                                            sx={{ textTransform: 'capitalize', minWidth: 0 }}
                                        >
                                            {s === 'all' ? 'All Status' : s}
                                        </Button>
                                    ))}

                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                                    {/* ── Category filter ── */}
                                    {(['all', ...CATEGORIES] as const).map((cat) => (
                                        <Button
                                            key={cat}
                                            size="small"
                                            variant={filterCategory === cat ? 'contained' : 'outlined'}
                                            onClick={() => {
                                                setFilterCategory(cat)
                                                setPaginationModel((m) => ({ ...m, page: 0 }))
                                            }}
                                            sx={{ textTransform: 'capitalize', minWidth: 0 }}
                                        >
                                            {cat === 'all' ? 'All Category' : cat}
                                        </Button>
                                    ))}

                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                                    {/* ── Create button ── */}
                                    <Button
                                        variant="contained"
                                        startIcon={<IconifyIcon icon="mdi:plus" />}
                                        onClick={() => setOpenCreate(true)}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            }
                        />
                        <Divider />

                        <DataGrid
                            rows={filteredProducts}
                            columns={columns}
                            disableColumnFilter
                            rowSelection={false}
                            pageSizeOptions={[10, 25, 50]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={({ page, pageSize }) => setPaginationModel({ page, pageSize })}
                            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                        />
                    </Card>
                </Grid>
            </Grid>

            {/* Create */}
            <ProductFormDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSubmit={handleCreate}
            />

            {/* Edit */}
            <ProductFormDialog
                open={!!editTarget}
                initial={editTarget}
                onClose={() => setEditTarget(null)}
                onSubmit={handleEdit}
            />

            {/* Delete */}
            <DeleteProductDialog
                open={!!deleteTarget}
                product={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </>
    )
}
