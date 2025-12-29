import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, ChevronDown, BadgeCent } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppConfig from '@/config/app';

export default function Navbar() {
    const { url, props } = usePage();
    const { auth } = props;
    const user = auth?.user;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path, exact = false) => {
        return exact ? url === path : url.startsWith(path);
    };

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--navbar-bg', AppConfig.navbarBackground);
        root.style.setProperty('--navbar-text', AppConfig.navbarText);
        root.style.setProperty('--navbar-active', AppConfig.navbarActive);
        root.style.setProperty('--navbar-hover', AppConfig.navbarHover);
    }, []);

    return (
        <nav className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-8">
                    {/* Logo / Brand */}
                    <div className="flex items-center grow">
                        <Link href="/" className="flex items-center text-white font-bold text-xl">
                            {/* Logo Home dari gambar online (white minimalist) */}
                            <img
                                src={AppConfig.logoUrl}
                                alt="Home"
                                className="w-10 h-10 mr-3 object-contain rounded-full"
                            />
                            {AppConfig.navbarTitle}
                        </Link>

                        {/* Menu Links - Desktop */}
                        <div className="hidden md:flex justify-end ml-10 grow">
                            <div className="flex gap-3">
                                <Link
                                    href="/"
                                    className={`
                                            px-3 py-2 rounded-md text-sm font-medium transition
                                                ${isActive('/', true)
                                            ? 'bg-[var(--navbar-active)] text-white'
                                            : 'text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white'}
    `}
                                >
                                    Home
                                </Link>

                                {/* Keranjang - hanya jika login */}
                                {user?.role === 'user' && (
                                    <Link
                                        href="/cart"
                                        className={`
        px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-2
        ${isActive('/cart')
                                                ? 'bg-[var(--navbar-active)] text-white'
                                                : 'text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white'}
    `}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Keranjang
                                    </Link>
                                )}

                                {/* Dashboard Admin - hanya admin */}
                                {user?.role === 'admin' && (
                                    <>
                                        <Link
                                            href="/transactions"
                                            className={`
        px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-2
        ${isActive('/transactions')
                                                    ? 'bg-[var(--navbar-active)] text-white'
                                                    : 'text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white'}
    `}
                                        >
                                            <BadgeCent className="w-5 h-5" />
                                            Transaksi
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className={`
        px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-2
        ${isActive('/dashboard')
                                                    ? 'bg-[var(--navbar-active)] text-white'
                                                    : 'text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white'}
    `}
                                        >
                                            Dashboard Admin
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center shrink-0">
                        {user ? (
                            <>
                                {/* Dropdown Profile - pakai click (lebih stabil) */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center text-gray-300 hover:text-white focus:outline-none"
                                    >
                                        <span className="mr-2">{user.name}</span>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            {user?.role === 'user' && (
                                                <Link
                                                    href="/transactions"
                                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Riwayat Transaksi
                                                </Link>
                                            )}
                                            <hr className="my-1" />
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-white text-indigo-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="text-gray-300 hover:text-white"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {mobileOpen && (
                        <div className="md:hidden px-4 pb-4 space-y-2">
                            <Link
                                href="/"
                                className={`block px-3 py-2 rounded-md text-sm font-medium
                ${isActive('/', true)
                                        ? 'bg-[var(--navbar-active)] text-white'
                                        : 'text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white'}
            `}
                                onClick={() => setMobileOpen(false)}
                            >
                                Home
                            </Link>

                            {/* User */}
                            {user?.role === 'user' && (
                                <Link
                                    href="/cart"
                                    className={`block px-3 py-2 rounded-md text-sm font-medium
                    ${isActive('/cart')
                                            ? 'bg-[var(--navbar-active)] text-white'
                                            : 'text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white'}
                `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Keranjang
                                </Link>
                            )}

                            {/* Admin */}
                            {user?.role === 'admin' && (
                                <>
                                    <Link
                                        href="/transactions"
                                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Transaksi
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Dashboard Admin
                                    </Link>
                                </>
                            )}

                            {/* AUTH MOBILE */}
                            {!user && (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[var(--navbar-hover)] hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-3 py-2 rounded-md text-sm bg-white text-indigo-800"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}

                            {/* Logout */}
                            {user && (
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Logout
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}