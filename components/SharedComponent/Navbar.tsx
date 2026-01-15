// components/navbar/Navbar.tsx
'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Heart,
  History,
  Shield,
  UserCircle,
  LogIn,
  UserPlus,
  Store,
  Info,
  Phone,
  Grid
} from 'lucide-react';
import { getMyProfile, logOutUser } from '@/app/utills/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CartContext } from '@/app/context/CartContext';
import { CartContextType } from '@/types/productType';


type UserType = {
  id: string;
  name: string;
  email?: string;
  role?: "ADMIN" | "SELLER" | "CUSTOMER";
  profilePhoto?: string;
  bio?: string;
};

// Categories data
const categories = [
  { id: '1', name: 'Furniture', slug: 'furniture', icon: '💻' },
  { id: '2', name: 'Clock', slug: 'clock', icon: '👕' },
  { id: '3', name: 'Electronics', slug: 'electronics', icon: '🏠' },
  { id: '4', name: 'cooking', slug: 'cooking', icon: '💄' },
  { id: '5', name: 'Lighting', slug: 'lighting', icon: '⚽' },
  { id: '6', name: 'Accessories', slug: 'accessories', icon: '📚' },
];

export default function Navbar() {

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const pathName = usePathname();



  const cartContext = useContext(CartContext) as CartContextType
  const cartItems = cartContext?.cartItems ?? []

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  /* -------------------- Fetch User -------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res?.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

   

    const queryParams = new URLSearchParams();
    queryParams.set('searchTerm', searchQuery);
    if (selectedCategory) {
      queryParams.set('category', selectedCategory);
    }

    router.push(`/products?${queryParams.toString()}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOutUser();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/products', label: 'All Products' },
    { href: '/contact', label: 'Contact' },
  ];

  // User dashboard links based on role
  const getUserLinks = () => {
    const commonLinks = [

      { href: '/dashboard/customer', label: 'My Dashboard', icon: Store },
      { href: '/dashboard/customer/profile', label: 'My Profile', icon: UserCircle },

      { href: '/wishlist', label: 'Wishlist', icon: Heart },
    ];

    if (user?.role === 'ADMIN') {
      return [
        { href: '/dashboard/admin/profile', label: 'My Profile', icon: UserCircle },
        { href: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield },
        { href: '/dashboard/admin/listings', label: 'Manage Products', icon: Package },
      ];
    }

    if (user?.role === 'SELLER') {
      return [

        { href: '/dashboard/seller/profile', label: 'My Profile', icon: UserCircle },
        { href: '/dashboard/seller', label: 'My Dashboard', icon: Store },
        { href: '/seller/products', label: 'My Products', icon: Package },
      ];
    }

    return commonLinks;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b'
        : 'bg-white dark:bg-gray-900'
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Shop<span className="text-primary">Cart</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium ${pathname === link.href ? 'text-primary' : ''
                    }`}
                >

                  <span>{link.label}</span>
                </Link>
              ))}

            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  {/* Category Select */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-r-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                  />

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Action Icons */}
            {/* Action Icons */}
            <div className="flex items-center space-x-3">

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {/* {!isLoading && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] bg-primary text-white rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )} */}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] bg-primary text-white rounded-full flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* User Section */}
              {loading ? (
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePhoto} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  {/* keep your dropdown content same */}
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-r-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none text-sm"
                  >
                    <option value="">All</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${pathname === link.href ? 'bg-primary/10 text-primary' : ''
                      }`}
                  >

                    <span>{link.label}</span>
                  </Link>
                ))}

                {/* Categories in Mobile */}
                <div className="px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                    <Grid className="h-4 w-4 mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Authentication in Mobile */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={user.profilePhoto} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {getUserLinks().map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                          </Link>
                        ))}

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="w-full justify-start border-primary text-primary hover:bg-primary/10"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        asChild
                        className="w-full justify-start bg-primary hover:bg-primary/90"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/register">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Styling for select dropdown arrow */}
      <style jsx global>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .dark select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        }
        
        select:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}