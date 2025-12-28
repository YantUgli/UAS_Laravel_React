import ProductCard from '@/Components/CardProduct';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import AppHead from '@/Components/AppHead';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products')
            .then(res => setProducts(res.data));
    }, []);

    return (
        <>
            <AppHead title="home" />
            <Navbar />
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        </>
    );
}
