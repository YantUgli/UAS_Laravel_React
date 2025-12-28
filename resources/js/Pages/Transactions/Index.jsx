import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FileText, User, Calendar, Download } from 'lucide-react';
import AppHead from '@/Components/AppHead';

export default function TransactionsIndex() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/transactions');
            setTransactions(res.data);
        } catch (error) {
            alert('Gagal memuat riwayat transaksi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const printTransaction = (transactionId) => {
        // Buka PDF di tab baru → otomatis download
        window.open(`/api/transactions/${transactionId}/print`, '_blank');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <AppHead title="Transaction" />


            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <FileText className="w-10 h-10 text-indigo-600" />
                    Riwayat Transaksi
                </h1>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat transaksi...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow">
                        <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <p className="text-xl text-gray-600">Belum ada transaksi</p>
                        {!isAdmin && (
                            <a href="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                                Mulai Belanja
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-indigo-600 text-white p-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">
                                            Transaksi #{transaction.id}
                                        </h3>
                                        <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                                            {transaction.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                    {/* Hanya admin lihat nama pembeli */}
                                    {isAdmin && transaction.user && (
                                        <div className="flex items-center gap-2 mt-2 text-sm">
                                            <User className="w-4 h-4" />
                                            {transaction.user.name}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h4 className="font-semibold mb-3">Daftar Produk:</h4>
                                    <ul className="space-y-3 mb-6">
                                        {transaction.items.map((item) => (
                                            <li key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-700">
                                                    {item.product.name} × {item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    {rupiah(item.price * item.quantity)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-indigo-600">
                                                {rupiah(transaction.total_price)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => printTransaction(transaction.id)}
                                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
                                    >
                                        <Download className="w-5 h-5" />
                                        Cetak Bukti Transaksi (PDF)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}