import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ auth }) {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);


    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: null,
    });

    /* ================= FETCH PRODUCTS ================= */
    const fetchProducts = () => {
        setLoading(true);
        axios.get("/api/products")
            .then(res => {
                setProducts(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /* ================= HANDLE FORM ================= */
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image" && files[0]) {
            setForm({ ...form, image: files[0] });
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            description: "",
            image: null,
        });
        setPreview(null);
        setEditId(null);
        setShowForm(false);
    };

    /* ================= SUBMIT ================= */
    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key]) data.append(key, form[key]);
        });

        const request = editId
            ? axios.post(`/api/products/${editId}`, data, {
                headers: { "X-HTTP-Method-Override": "PUT" }
            })
            : axios.post("/api/products", data);

        request
            .then(() => {
                fetchProducts();
                resetForm();
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    /* ================= EDIT ================= */
    const editProduct = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            description: p.description,
            image: null,
        });
        setEditId(p.id);
        setShowForm(true);
    };

    /* ================= DELETE ================= */
    const deleteProduct = (id) => {
        if (!confirm("Yakin hapus produk ini?")) return;

        setDeletingId(id);

        axios.delete(`/api/products/${id}`)
            .then(() => fetchProducts())
            .finally(() => setDeletingId(null));
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Produk" />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Dashboard Produk
                    </h1>

                    <div className="space-x-2">
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            + Tambah Produk
                        </button>

                        <a
                            href={route("dashboard.print.products")}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Cetak Produk
                        </a>
                    </div>
                </div>

                {/* FORM */}
                {showForm && (
                    <div className="bg-white shadow rounded p-6 mb-6">
                        <h2 className="font-semibold mb-6 text-lg">
                            {editId ? "Edit Produk" : "Tambah Produk"}
                        </h2>

                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">

                            {/* NAMA PRODUK */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Nama Produk
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>

                            {/* HARGA */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>

                            {/* IMAGE */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Gambar Produk (Opsional)
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            {/* PREVIEW IMAGE */}
                            {preview && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">
                                        Preview Gambar
                                    </label>

                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={preview}
                                            className="w-32 h-32 object-cover rounded border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setForm({ ...form, image: null });
                                            }}
                                            className="px-3 py-2 bg-red-500 text-white rounded"
                                        >
                                            Hapus Gambar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* DESKRIPSI */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    rows="3"
                                />
                            </div>

                            {/* BUTTON */}
                            <div className="col-span-2 flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-4 py-2 rounded text-white ${submitting ? "bg-gray-400" : "bg-indigo-600"}`}
                                >
                                    {submitting ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>

                        </form>
                    </div>
                )}


                {/* TABLE */}
                <div className="bg-white shadow rounded">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-left">Harga</th>
                                <th className="p-3 text-left">Deskripsi</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-500">Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && products.map(p => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-3 text-gray-400">
                                        {p.image ? (
                                            <img
                                                src={`/storage/${p.image}`}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : 'no image'}
                                    </td>
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3"> {rupiah(p.price)}</td>
                                    <td className="p-3">{p.description ? p.description : 'no desc..'}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => editProduct(p)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(p.id)}
                                            disabled={deletingId === p.id}
                                            className={`px-3 py-1 rounded text-white ${deletingId === p.id ? "bg-gray-400" : "bg-red-600"
                                                }`}
                                        >
                                            {deletingId === p.id ? "Menghapus..." : "Hapus"}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!loading && products.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-500">
                                        Belum ada produk
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
