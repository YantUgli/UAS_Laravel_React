import { Link, usePage } from '@inertiajs/react';
import { Home, LogIn, UserPlus } from 'lucide-react'; // Optional: icon lucide

export default function Navbar() {
    const { url } = usePage(); // Untuk cek route aktif

    const isActive = (path) => {
        return url.startsWith(path) ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-600 hover:text-white';
    };

    return (
        <nav className="bg-indigo-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center text-white font-bold text-xl">
                            <Home className="w-8 h-8 mr-2" />
                            MyApp
                        </Link>

                        {/* Menu Links */}
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link
                                    href="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center gap-2 ${isActive('/')}`}
                                >
                                    <Home className="w-4 h-4" />
                                    Home
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login & Register */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-300 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="bg-white text-indigo-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button (opsional nanti bisa ditambah dropdown) */}
                    <div className="md:hidden">
                        <button className="text-gray-300 hover:text-white focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}