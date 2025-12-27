import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function Index() {
    const { auth } = usePage().props;
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Fetch cart saat page load
    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/cart');
            setCart({
                items: res.data.items || [],
                total: res.data.total || 0
            });
        } catch (error) {
            alert('Gagal memuat keranjang');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Hapus item dari keranjang
    const removeItem = async (productId) => {
        try {
            const res = await axios.post('/api/cart/remove', { product_id: productId });
            setCart({
                items: res.data.cart || [],
                total: res.data.total || 0
            });
        } catch (error) {
            alert('Gagal hapus item');
        }
    };

    // Checkout
    const checkout = async () => {
        if (cart.items.length === 0) {
            alert('Keranjang kosong!');
            return;
        }

        if (!confirm('Yakin checkout semua item ini?')) return;

        try {
            const res = await axios.post('/api/checkout');
            alert(res.data.message || 'Checkout berhasil!');
            setCart({ items: [], total: 0 }); // Kosongkan keranjang
            // Optional: redirect ke halaman transaksi
            router.visit('/transactions');
        } catch (error) {
            alert('Checkout gagal: ' + (error.response?.data?.message || 'Error'));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Keranjang Belanja" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingCart className="w-10 h-10 text-indigo-600" />
                    Keranjang Belanja
                </h1>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat keranjang...</p>
                    </div>
                ) : cart.items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow">

                        <grok-card data-id="199224" data-type="image_card" data-arg-size="LARGE" ></grok-card>

                        <p className="text-xl text-gray-600 mt-6">Keranjangmu masih kosong</p>
                        <a href="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                            Belanja Sekarang
                        </a>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Daftar Item */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow overflow-hidden">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex items-center p-6 border-b last:border-0">
                                        {item.product.image ? (
                                            <img
                                                src={`/storage/${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded-lg mr-6"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg mr-6 flex items-center justify-center">
                                                <span className="text-gray-500 text-xs">No Image</span>
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                                            <p className="text-indigo-600 font-bold">{rupiah(item.product.price)}</p>
                                            <p className="text-gray-600">Jumlah: {item.quantity}</p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-red-600 hover:text-red-800 transition p-3"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ringkasan Total */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                                <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
                                <div className="flex justify-between text-lg mb-6">
                                    <span>Total Harga</span>
                                    <span className="font-bold text-indigo-600">{rupiah(cart.total)}</span>
                                </div>

                                <grok-card data-id="bcf1e2" data-type="image_card" data-arg-size="LARGE" ></grok-card>


                                <button
                                    onClick={checkout}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-3 mt-4"
                                >
                                    Checkout Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}