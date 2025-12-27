import axios from 'axios';
import { usePage, router } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react'; // Icon bag biru dari Lucide

export default function ProductCard({ product }) {
    const { auth } = usePage().props; // Ambil auth dari Inertia props
    const user = auth?.user;

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const addToCart = async () => {
        if (!user) {
            // Jika belum login → redirect ke login dengan intended url
            router.visit('/login', {
                data: { intended: window.location.pathname },
            });
            return;
        }

        try {
            const response = await axios.post('/api/cart/add', {
                product_id: product.id,
                quantity: 1
            });

            alert('Produk berhasil ditambahkan ke keranjang! 🛒');
            // Optional: update badge keranjang di navbar nanti
        } catch (error) {
            if (error.response?.status === 401) {
                router.visit('/login');
            } else {
                alert('Gagal tambah ke keranjang: ' + (error.response?.data?.message || 'Error'));
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-xl transition duration-300">
            {product.image ? (
                <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                </div>
            )}

            <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-indigo-600 font-bold text-xl mb-3">
                    {rupiah(product.price)}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description || 'Tidak ada deskripsi'}
                </p>

                {/* Tombol Tambah ke Keranjang */}
                <button
                    onClick={addToCart}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
                >
                    <ShoppingBag className="w-5 h-5" />
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}