import React, { useState, useEffect, useRef } from "react";
import './user.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentElement, usePaymentIntent } from '@stripe/react-stripe-js';    // Stripe client initialization using Vite env variable `VITE_STRIPE_PUBLISHABLE_KEY`
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
    // --- Supabase Initialization ---
    // NOTE: Ensure your .env file has VITE_ prefix (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const PRODUCT_BUCKET_NAME = 'product-images';


    let supabase = null;
    try {
    const isConfigValid = SUPABASE_URL && SUPABASE_KEY;
    const isSupabaseClientLoaded = typeof window.supabase !== 'undefined' && 
                                    typeof window.supabase.createClient === 'function';
    if (isConfigValid) {
        if (isSupabaseClientLoaded) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase client successfully initialized.");
        } else {
        console.error("Supabase client library is not loaded.");
        }
    } else {
        console.warn("Supabase environment variables are missing.");
    }
    } catch (e) {
    console.error("Critical error during Supabase initialization:", e);
    }

    // --- Custom App CSS ---
    const AppStyles = () => (
    <style>{`
        :root {
        --evo-yellow: #eab308;
        }
        /* Base */
        body {
        font-family: 'Inter', sans-serif;
        background-color: #000;
        }
        /* Creative Scrollbar */
        ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        }
        ::-webkit-scrollbar-track {
        background: #09090b;
        }
        ::-webkit-scrollbar-thumb {
        background: #27272a;
        border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
        background: var(--evo-yellow);
        }
        /* Utilities */
        .scrollbar-hide::-webkit-scrollbar {
        display: none;
        }
        .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
        }
        /* Glass effects */
        .glass-panel {
            background: rgba(24, 24, 27, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
    `}</style>
    );

    // --- Utility Functions ---
    const getPublicProductImageUrl = (imagePath) => {
    if (!supabase || !imagePath) return null;
    const { data } = supabase.storage.from(PRODUCT_BUCKET_NAME).getPublicUrl(imagePath);
    return data?.publicUrl || null;
    };

    // --- Icons (Inline SVG) ---
    const Icon = ({ children, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
    );
    const Loader = ({ className = "w-5 h-5 text-yellow-500" }) => (
    <Icon className={className + " animate-spin"}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Icon>
    );
    const ArrowLeft = (props) => (<Icon {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></Icon>);
    const Eye = (props) => (<Icon {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>);
    const EyeOff = (props) => (<Icon {...props}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.56 13.56 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.36-1.39"/><line x1="2" x2="22" y1="2" y2="22"/></Icon>);
    const User = (props) => (<Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>);
    const Lock = (props) => (<Icon {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>);
    const Mail = (props) => (<Icon {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.83 1.83 0 0 1-2.06 0L2 7"/></Icon>);
    const Phone = (props) => (<Icon {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.66-3.66A19.79 19.79 0 0 1 3 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 2 15.7 15.7 0 0 0 .8 1.82 2 2 0 0 1-.49 2.02l-1.07 1.07a11.5 11.5 0 0 0 5.4 5.4l1.07-1.07a2 2 0 0 1 2.02-.49A15.7 15.7 0 0 0 18 14a2 2 0 0 1 2 2z"/></Icon>);
    const Cake = (props) => (<Icon {...props}><path d="M20 7v5h-4"/><path d="M4 7v5h4"/><path d="M12 2v10"/><path d="M20 7h-4"/><path d="M4 7h4"/><path d="M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M12 12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"/></Icon>);
    const Home = (props) => (<Icon {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>);
    const ShoppingBag = (props) => (<Icon {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></Icon>);
    const BookOpen = (props) => (<Icon {...props}><path d="M2 13V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/><path d="M2 17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/><path d="M4 19v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></Icon>);
    const ShoppingCart = (props) => (<Icon {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 12.81a2 2 0 0 0 2 1.69h9.72a2 2 0 0 0 2-1.69L23 6H6" /></Icon>);
    const Trash = (props) => (<Icon {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></Icon>);
    const Plus = (props) => (<Icon {...props}><path d="M5 12h14" /><path d="M12 5v14" /></Icon>);
    const Minus = (props) => (<Icon {...props}><path d="M5 12h14" /></Icon>);
    const Check = (props) => (<Icon {...props}><polyline points="20 6 9 17 4 12" /></Icon>);
    const MapPin = (props) => (<Icon {...props}><path d="M12 21.7C17.3 17 22 13 22 10a8 8 0 0 0-16 0c0 3 4.7 7 10 11.7z"/><circle cx="12" cy="10" r="3"/></Icon>);
    const DollarSign = (props) => (<Icon {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Icon>);
    const Search = (props) => (<Icon {...props}><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></Icon>);
    const Filter = (props) => (<Icon {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Icon>);
    const X = (props) => (<Icon {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>);


    const MessageModal = ({ message, type, onClose }) => {
    if (!message) return null;
    const bgColor = type === 'error' ? 'bg-red-900/80 border-red-500' : 'bg-green-900/80 border-green-500';
    const textColor = type === 'error' ? 'text-red-200' : 'text-green-200';
    const titleColor = type === 'error' ? 'text-red-500' : 'text-green-500';
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
        <div className={`${bgColor} border ${textColor} p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all scale-100`}>
            <h3 className={`text-xl font-extrabold uppercase ${titleColor} mb-3`}>{type === 'error' ? 'Error' : 'Success'}</h3>
            <p className="text-sm mb-6 font-medium">{message}</p>
            <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl text-black font-bold uppercase transition duration-200 bg-white hover:bg-gray-200`}
            >
            Dismiss
            </button>
        </div>
        </div>
    );
    };

    const InputField = ({ label, name, type = "text", value, onChange, placeholder, icon: IconComponent, required = true, isTextArea = false, className="" }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const InputComponent = isTextArea ? 'textarea' : 'input';

    return (
        <div className={`mb-4 ${className}`}>
        <label htmlFor={name} className="sr-only">{label}</label>
        <div className="relative">
            <div className={`absolute inset-y-0 left-0 flex items-center pl-4 ${isTextArea ? 'top-4 items-start' : 'pointer-events-none'}`}>
            {IconComponent && <IconComponent className="h-5 w-5 text-zinc-500" />}
            </div>
            <InputComponent
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={isTextArea ? 3 : undefined}
            className={`block w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-4 ${isTextArea ? 'pl-12' : 'pl-12 pr-12'} text-white placeholder-zinc-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition duration-200 sm:text-sm`}
            />
            {isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer group" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 
                <EyeOff className="h-5 w-5 text-zinc-500 group-hover:text-white transition" /> : 
                <Eye className="h-5 w-5 text-zinc-500 group-hover:text-white transition" />
                }
            </div>
            )}
        </div>
        </div>
    );
    };

    const NavHeader = ({ currentScreen, onNavigate, user, cartItemCount = 0 }) => {
    const navItems = [
        { name: 'HOME', screen: 'home', icon: Home },
        { name: 'SHOP', screen: 'shop', icon: ShoppingBag },
        { name: 'ABOUT', screen: 'about', icon: BookOpen },
    ];
    const isLoggedIn = !!user;
    const displayName = isLoggedIn
        ? user.user_metadata?.username?.toUpperCase() || user.email?.split('@')[0].toUpperCase() || 'PROFILE'
        : null;
        
    return (
        <div className="flex justify-between items-center px-4 py-3 bg-black/90 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-30">
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-yellow-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Home className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tighter">EVO</span>
        </div>
        
        <div className="hidden md:flex space-x-1 bg-zinc-900/50 p-1 rounded-full border border-zinc-800">
            {navItems.map(item => (
            <button 
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all duration-300 ${
                currentScreen === item.screen ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
            >
                {item.name}
            </button>
            ))}
        </div>
        
        <div className="flex items-center space-x-3">
            {isLoggedIn ? (
            <button onClick={() => onNavigate('profile')} className="hidden sm:block text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-full transition border border-zinc-700">
                {displayName}
            </button>
            ) : (
            <button onClick={() => onNavigate('login')} className="text-black bg-yellow-500 hover:bg-yellow-400 px-5 py-2 rounded-full text-xs font-bold uppercase transition shadow-lg shadow-yellow-500/10">
                Login
            </button>
            )}
            <div className="relative cursor-pointer group" onClick={() => onNavigate('cart')}>
                <div className="p-2 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-yellow-500 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
                </div>
            {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-black">
                {cartItemCount}
                </span>
            )}
            </div>
        </div>
        </div>
    );
    };

    const SizeSelector = ({ availableSizes, selectedSize, onSelect }) => {
        const defaultSizes = ['S', 'M', 'L', 'XL'];
        const sizes = availableSizes && availableSizes.length > 0 ? availableSizes : defaultSizes;
        return (
            <div className="flex flex-wrap gap-2 my-3">
                {sizes.map(size => (
                    <button
                        key={size}
                        onClick={(e) => { e.stopPropagation(); onSelect(size); }}
                        className={`
                            min-w-[2.5rem] h-8 px-2 flex items-center justify-center text-xs font-bold rounded-md border 
                            transition-all duration-200
                            ${selectedSize === size
                                ? 'bg-white border-white text-black shadow-md scale-105'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                            }
                        `}
                    >
                        {size}
                    </button>
                ))}
            </div>
        );
    };

    // --- SHOP SCREEN (Revamped with Sidebar) ---
    const colors = ['All', 'Black', 'White', 'Red', 'Blue', 'Yellow', 'Gray', 'Matte Black'];

    const ShopScreen = ({ onNavigate, addToCart, cartItemCount, user }) => {
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedColorCategory, setSelectedColorCategory] = useState('All');
        const [selectedSizes, setSelectedSizes] = useState({});
        const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New Sidebar State

        useEffect(() => {
            fetchProducts(searchQuery, selectedColorCategory);
        }, [searchQuery, selectedColorCategory]);

        const fetchProducts = async (query = '', colorCategory = 'All') => {
            if (!supabase) {
                setError('Supabase not initialized.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                let queryBuilder = supabase.from('products').select('*');
                if (colorCategory !== 'All') {
                    queryBuilder = queryBuilder.ilike('color', colorCategory);
                }
                if (query.trim()) {
                    const searchPattern = `%${query.trim()}%`;
                    queryBuilder = queryBuilder.or(`name.ilike.${searchPattern},color.ilike.${searchPattern}`);
                }
                const { data, error } = await queryBuilder.order('price', { ascending: true });
                if (error) throw error;
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err.message);
                setError(`Failed to load products: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        const handleSizeSelect = (productId, size) => {
            setSelectedSizes(prev => ({ ...prev, [productId]: size }));
        };

        const handleAddToCartClick = (product) => {
            const size = selectedSizes[product.id] || 'M';
            addToCart(product, size);
        };

        const ProductCard = ({ product }) => {
            const defaultSize = 'M';
            const currentSize = selectedSizes[product.id] || defaultSize;
            useEffect(() => {
                if (!selectedSizes[product.id]) setSelectedSizes(prev => ({ ...prev, [product.id]: defaultSize }));
            }, [product.id]);

            const imageUrl = getPublicProductImageUrl(product.image_path);
            
            return (
                <div className="group flex flex-col bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 hover:bg-zinc-900/80 transition-all duration-300">
                    <div className="relative h-52 sm:h-64 overflow-hidden bg-zinc-950 flex items-center justify-center p-4">
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/111/333?text=No+Image"; }}
                            />
                        ) : (
                            <span className="text-zinc-700 font-bold uppercase tracking-widest">[No Image]</span>
                        )}
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-white/10">
                            {product.color || 'N/A'}
                        </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex-grow">
                            <h3 className="text-base font-bold text-white line-clamp-1">{product.name}</h3>
                            <p className="text-zinc-500 text-xs mt-1 mb-3 line-clamp-2 min-h-[32px]">{product.description}</p>
                            <div className="flex items-baseline space-x-2">
                                <p className="text-yellow-500 font-extrabold text-xl">₱{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-zinc-800/50">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Size</span>
                            <SizeSelector selectedSize={currentSize} onSelect={(size) => handleSizeSelect(product.id, size)} />
                            <button
                                className="mt-2 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
                                onClick={(e) => { e.stopPropagation(); handleAddToCartClick(product); }}
                            >
                                <Plus className="w-5 h-5" />
                                <span>ADD TO CART</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex flex-col h-full bg-black text-white">
                <NavHeader currentScreen="shop" onNavigate={onNavigate} user={user} cartItemCount={cartItemCount} />
                
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Mobile Sidebar Overlay */}
                    <div 
                        className={`fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* SIDEBAR - Drawer on mobile, static column on desktop */}
                    <aside className={`
                        absolute lg:relative inset-y-0 left-0 z-50 w-72 lg:w-64 bg-zinc-950 lg:bg-black border-r border-zinc-800
                        flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center lg:hidden">
                            <span className="text-sm font-extrabold uppercase text-white tracking-widest">Filters</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {/* Search Section */}
                            <div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center">
                                    <Search className="w-3 h-3 mr-2" /> Search
                                </h4>
                                <InputField
                                    name="search"
                                    placeholder="Find your helmet..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    required={false}
                                    className="!mb-0"
                                />
                            </div>

                            {/* Categories Section */}
                            <div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center">
                                    <Filter className="w-3 h-3 mr-2" /> Color Category
                                </h4>
                                <div className="space-y-1">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => { setSelectedColorCategory(color); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                selectedColorCategory === color
                                                    ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20'
                                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                            }`}
                                        >
                                            {color}
                                            {selectedColorCategory === color && <Check className="w-4 h-4"/>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Grid Area */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" id="shop-main">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">SHOP <span className="text-yellow-500">GEAR</span></h1>
                                <p className="text-zinc-400 text-sm sm:text-base mt-1">Explore premium protection.</p>
                            </div>
                            {/* Mobile Filter Trigger */}
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden flex items-center px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-white text-xs font-bold uppercase tracking-wider hover:border-yellow-500 transition-all"
                            >
                                <Filter className="w-4 h-4 mr-2 text-yellow-500"/> Filters
                            </button>
                        </div>

                        {loading && (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <Loader className="w-10 h-10 text-yellow-500" />
                                <p className="text-zinc-500 animate-pulse font-medium">Loading Gear...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="p-6 bg-red-950/30 border border-red-900 rounded-2xl text-center">
                                <p className="text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        {!loading && products.length === 0 && !error && (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                                <Search className="w-12 h-12 mb-4 opacity-20"/>
                                <p className="text-lg font-medium">No matching products found.</p>
                                <p className="text-sm mt-2">Try adjusting your filters.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    // --- CART SCREEN ---
    const CartScreen = ({ onNavigate, cartItems, updateQuantity, removeFromCart, user, selectedCartItems, toggleItemSelection, toggleSelectAll }) => {
        const [loading, setLoading] = useState(false);
        const selectAllRef = useRef(null);

        const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
        const shipping = selectedCartItems.length > 0 ? 5.00 : 0;
        const total = subtotal + shipping;
        const allSelected = cartItems.length > 0 && selectedCartItems.length === cartItems.length;
        const isIndeterminate = selectedCartItems.length > 0 && selectedCartItems.length < cartItems.length;

        useEffect(() => {
            if (selectAllRef.current) selectAllRef.current.indeterminate = isIndeterminate;
        }, [isIndeterminate]);

        const CartItem = ({ item }) => {
            const isSelected = selectedCartItems.some(sItem => sItem.product_id === item.product_id && sItem.size === item.size);
            const imageUrl = getPublicProductImageUrl(item.products.image_path);
            return (
                <div className={`flex flex-col sm:flex-row bg-zinc-900/50 border ${isSelected ? 'border-yellow-500/30' : 'border-zinc-800'} rounded-2xl p-4 mb-4 transition-all duration-200`}>
                    <div className="flex items-center mb-4 sm:mb-0">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.product_id, item.size)}
                            className="h-5 w-5 text-yellow-500 bg-zinc-800 border-zinc-700 rounded focus:ring-yellow-500 focus:ring-offset-zinc-900 transition cursor-pointer"
                        />
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-zinc-950 rounded-xl ml-4 p-2 flex-shrink-0 border border-zinc-800 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                                <img src={imageUrl} alt={item.products.name} className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/111/333?text=No+Img"; }} />
                            ) : <span className="text-xs text-zinc-700">[No Img]</span>}
                        </div>
                    </div>
                    
                    <div className="flex-grow sm:ml-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-white font-bold text-lg line-clamp-1 mr-2">{item.products.name}</h3>
                                <button onClick={() => removeFromCart(item.product_id, item.size)} disabled={loading} className="text-zinc-600 hover:text-red-500 transition p-1">
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex space-x-4 text-sm mt-1">
                                <p className="text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md">Size: <span className="text-white font-bold">{item.size}</span></p>
                                <p className="text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md">Color: <span className="text-white font-bold">{item.products.color || 'N/A'}</span></p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4 sm:mt-0">
                            <p className="text-yellow-500 font-extrabold text-lg">₱{item.products.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <div className="flex items-center bg-zinc-800 rounded-full p-1 border border-zinc-700">
                                <button onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)} disabled={item.quantity <= 1 || loading} className="w-8 h-8 flex items-center justify-center bg-zinc-700 text-white rounded-full hover:bg-zinc-600 disabled:opacity-30 transition">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)} disabled={loading} className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex flex-col h-full bg-black text-white">
                <NavHeader currentScreen="cart" onNavigate={onNavigate} user={user} cartItemCount={cartItems.length} />
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <h1 className="text-3xl font-extrabold text-white mb-6 tracking-tight">YOUR <span className="text-yellow-500">CART</span></h1>
                        {cartItems.length > 0 ? (
                            <>
                                <label className="flex items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl mb-6 cursor-pointer hover:bg-zinc-900 transition">
                                    <input type="checkbox" checked={allSelected} ref={selectAllRef} onChange={(e) => toggleSelectAll(e.target.checked)} className="h-5 w-5 text-yellow-500 bg-zinc-800 border-zinc-700 rounded focus:ring-yellow-500 transition cursor-pointer" />
                                    <span className="ml-4 font-bold text-sm uppercase tracking-wider">Select All ({selectedCartItems.length} items)</span>
                                </label>
                                <div className="space-y-4">
                                    {cartItems.map(item => <CartItem key={`${item.product_id}-${item.size}`} item={item} />)}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-3xl">
                                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-xl font-bold text-zinc-400">Your cart is empty.</p>
                                <button onClick={() => onNavigate('shop')} className="mt-6 px-8 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition">
                                    GO SHOPPING
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Cart Summary Side Panel on Desktop, Bottom Sheet on Mobile */}
                    {cartItems.length > 0 && (
                        <div className="lg:w-[400px] bg-zinc-900/80 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 flex flex-col justify-center backdrop-blur-md">
                            <h2 className="text-xl font-extrabold uppercase tracking-wider mb-6 hidden lg:block">Order Summary</h2>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between text-zinc-400"><span>Subtotal ({selectedCartItems.length} items)</span><span>₱{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-zinc-400"><span>Shipping</span><span>₱{shipping.toFixed(2)}</span></div>
                                <div className="h-px bg-zinc-800 my-4"></div>
                                <div className="flex justify-between text-xl font-extrabold">
                                    <span>Total</span>
                                    <span className="text-yellow-500">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onNavigate('checkout', { total, subtotal, shipping, selectedItems: selectedCartItems })}
                                disabled={selectedCartItems.length === 0 || loading}
                                className={`w-full mt-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-200 ${selectedCartItems.length === 0 || loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95'}`}
                            >
                                {loading ? <Loader className="mx-auto" /> : 'CHECKOUT NOW'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- PAYMENT FORM (Stripe Elements) ---
    const backendBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    const PaymentForm = ({ amount, onSuccess, onError, onProcessing }) => {
        const stripe = useStripe();
        const elements = useElements();
        const [cardReady, setCardReady] = useState(false);
        const [processing, setProcessing] = useState(false);

        useEffect(() => {
            let mounted = true;
            // Poll briefly until the CardElement is available (Stripe Elements mounts asynchronously)
            const check = () => {
                try {
                    const el = elements && elements.getElement && elements.getElement(CardElement);
                    if (mounted && !!el) setCardReady(true);
                } catch (e) {
                    // ignore
                }
            };
            check();
            const id = setInterval(check, 250);
            return () => { mounted = false; clearInterval(id); };
        }, [elements]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!stripe || !elements) return onError('Stripe not loaded');
            const card = elements.getElement(CardElement);
            if (!card) return onError('Card input not found. Please refresh the page and try again.');
            setProcessing(true);
            onProcessing(true);
            try {
                const res = await fetch(`${backendBase}/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.error || `Server error: ${res.status}`);
                }
                const data = await res.json();
                const clientSecret = data.clientSecret || data.client_secret;
                if (!clientSecret) throw new Error('Payment initialization failed (missing client secret)');
                const card = elements.getElement(CardElement);
                if (!card) throw new Error('Card input not found');

                const confirm = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });

                if (confirm.error) throw confirm.error;
                if (confirm.paymentIntent && confirm.paymentIntent.status === 'succeeded') {
                    onSuccess(confirm.paymentIntent);
                } else {
                    throw new Error('Payment not completed. Status: ' + (confirm.paymentIntent?.status || 'unknown'));
                }
            } catch (err) {
                onError(err.message || 'Payment failed');
            } finally {
                setProcessing(false);
                onProcessing(false);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-zinc-900/20 border border-zinc-800 rounded-xl">
                    <CardElement options={{ hidePostalCode: true, style: { base: { color: '#fff', '::placeholder': { color: '#9CA3AF' } } } }} />
                </div>
                <button type="submit" disabled={!cardReady || processing} className={`w-full py-3 rounded-xl font-black uppercase tracking-widest ${(!cardReady || processing) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}>
                    {processing ? 'Processing…' : `Pay ₱${amount.toFixed(2)}`}
                </button>
                {!cardReady && <p className="text-xs text-zinc-400 mt-2">Card input loading — please wait a moment.</p>}
            </form>
        );
    };

    // --- CHECKOUT SCREEN ---
    const CheckoutScreen = ({ onNavigate, user, orderSummary, placeOrder }) => {
        const [profile, setProfile] = useState(null);
        const [loading, setLoading] = useState(true);
        const [selectedPayment, setSelectedPayment] = useState('COD');
        const itemsToCheckout = orderSummary?.selectedItems || [];

        useEffect(() => {
            const fetchProfile = async () => {
                if (!supabase || !user) { setLoading(false); return; }
                try {
                    const { data, error } = await supabase.from('profiles').select('full_name, address, phone').eq('id', user.id).single();
                    if (error) throw error;
                    setProfile(data);
                } catch (error) {
                    console.error("Error fetching profile:", error.message);
                } finally { setLoading(false); }
            };
            fetchProfile();
        }, [user]);
        
        if (loading) return <div className="flex h-full bg-black items-center justify-center"><Loader className="w-10 h-10" /></div>;
        const isAddressMissing = !profile || !profile.address;

        return (
            <div className="flex flex-col h-full bg-black text-white">
                <div className="p-4 flex items-center bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-10">
                    <button onClick={() => onNavigate('cart')} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-lg font-black uppercase tracking-widest ml-4">Checkout</h1>
                </div>

                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* Address Card */}
                    <div className={`p-6 rounded-2xl border ${isAddressMissing ? 'bg-red-950/20 border-red-900' : 'bg-zinc-900/50 border-yellow-500/50'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center text-zinc-300"><MapPin className="w-4 h-4 mr-2 text-yellow-500" /> Shipping Details</h2>
                            <button onClick={() => onNavigate('profile')} className="text-xs font-bold text-yellow-500 hover:underline uppercase">
                                {isAddressMissing ? 'Add Address' : 'Change'}
                            </button>
                        </div>
                        {isAddressMissing ? (
                            <p className="text-red-400 text-sm font-medium flex items-center"><Icon className="w-4 h-4 mr-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon> Delivery address required.</p>
                        ) : (
                            <div className="space-y-1">
                                <p className="font-bold text-white text-lg">{profile.full_name}</p>
                                <p className="text-zinc-400">{profile.phone}</p>
                                <p className="text-zinc-300 leading-relaxed">{profile.address}</p>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 bg-zinc-900/80 border-b border-zinc-800">
                            <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-300">Order Items ({itemsToCheckout.length})</h2>
                        </div>
                        <div className="divide-y divide-zinc-800/50">
                            {itemsToCheckout.map(item => (
                                <div key={`${item.product_id}-${item.size}`} className="p-4 flex items-center">
                                    <img 
                                        src={getPublicProductImageUrl(item.products?.image_path)} 
                                        alt={item.products.name} 
                                        className="w-16 h-16 object-contain bg-zinc-950 rounded-lg border border-zinc-800 p-1" 
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/111/333?text=IMG"; }}
                                    />
                                    <div className="ml-4 flex-1">
                                        <p className="font-bold text-white line-clamp-1">{item.products.name}</p>
                                        <p className="text-xs text-zinc-400 mt-1">Size: <span className="text-yellow-500">{item.size}</span> | Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-zinc-300">₱{(item.products.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-300 mb-4 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-yellow-500" /> Payment</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${selectedPayment === 'COD' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-zinc-900 border-zinc-800'}`}>
                                <input type="radio" name="payment" value="COD" checked={selectedPayment === 'COD'} onChange={() => setSelectedPayment('COD')} className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 bg-zinc-800 border-zinc-600" />
                                <span className="ml-3 font-bold">Cash on Delivery</span>
                            </label>

                            <label className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${selectedPayment === 'CARD' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-zinc-900 border-zinc-800'}`}>
                                <input type="radio" name="payment" value="CARD" checked={selectedPayment === 'CARD'} onChange={() => setSelectedPayment('CARD')} className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 bg-zinc-800 border-zinc-600" />
                                <span className="ml-3 font-bold">Pay with Card (Stripe)</span>
                            </label>

                            {selectedPayment === 'CARD' && (
                                <div className="mt-4">
                                    {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
                                        <Elements stripe={stripePromise}>
                                            <PaymentForm amount={orderSummary.total} onSuccess={async (paymentIntent) => {
                                                const addr = profile?.address || '';
                                                const normalizedStatus = paymentIntent?.status === 'succeeded' ? 'paid' : (paymentIntent?.status || null);
                                                const orderCreated = await placeOrder(orderSummary.total, addr, 'CARD', orderSummary.selectedItems, paymentIntent.id, normalizedStatus);
                                                if (orderCreated) onNavigate('orders');
                                            }} onError={(msg) => onNavigate('message', { message: msg, type: 'error' })} onProcessing={() => {}} />
                                        </Elements>
                                    ) : (
                                        <p className="text-sm text-red-400">Stripe publishable key is not configured. Set `VITE_STRIPE_PUBLISHABLE_KEY` in your .env.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 safe-bottom">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-zinc-400 font-medium">Total Payment</span>
                        <span className="text-2xl font-black text-yellow-500">₱{orderSummary.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    {selectedPayment === 'COD' ? (
                        <button
                            onClick={async () => {
                                const success = await placeOrder(orderSummary.total, profile.address, selectedPayment, itemsToCheckout);
                                if (success) onNavigate('orders');
                            }}
                            disabled={isAddressMissing || itemsToCheckout.length === 0}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${isAddressMissing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}
                        >
                            {isAddressMissing ? 'Add Address to Continue' : 'Place Order'}
                        </button>
                    ) : (
                        <button disabled className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-zinc-800 text-zinc-500 cursor-not-allowed">
                            Complete payment using card form above
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // --- ORDER HISTORY SCREEN ---
    const OrderHistoryScreen = ({ user, onNavigate, cartItemCount }) => {
        const [orders, setOrders] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedOrder, setSelectedOrder] = useState(null);
        const [modalOpen, setModalOpen] = useState(false);
        const [modalLoading, setModalLoading] = useState(false);
        const [modalMessage, setModalMessage] = useState(null);

        useEffect(() => {
            const fetchOrders = async () => {
                if (!supabase || !user) { setLoading(false); return; }
                try {
                    const { data, error } = await supabase.from('orders').select(`id, status, created_at, total_amount, order_items (quantity, products (name, image_path, color))`).eq('user_id', user.id).order('created_at', { ascending: false });
                    if (error) throw error;
                    setOrders(data);
                } catch (err) { console.error('Error fetching orders:', err); } finally { setLoading(false); }
            };
            fetchOrders();
        }, [user]);

        const openOrderModal = (order) => {
            setSelectedOrder(order);
            setModalMessage(null);
            setModalOpen(true);
        };
        const closeOrderModal = () => { setModalOpen(false); setSelectedOrder(null); };

        const updateOrderStatus = async (orderId, newStatus) => {
            if (!supabase) return { error: { message: 'Supabase not initialized' } };
            try {
                setModalLoading(true);
                const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId).select().single();
                if (error) throw error;
                // Update local orders list
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: data.status } : o));
                setModalMessage('Order updated.');
                return { data };
            } catch (err) {
                console.error('Update order error:', err);
                setModalMessage(err.message || 'Failed to update order.');
                return { error: err };
            } finally { setModalLoading(false); }
        };

        const cancelOrder = async (orderId) => {
            if (!confirm('Are you sure you want to cancel this order?')) return;
            const res = await updateOrderStatus(orderId, 'cancelled');
            if (!res.error) closeOrderModal();
        };

        const markReceived = async (orderId) => {
            const res = await updateOrderStatus(orderId, 'received');
            if (!res.error) closeOrderModal();
        };

        const markPaid = async (orderId) => {
            const res = await updateOrderStatus(orderId, 'paid');
            if (!res.error) closeOrderModal();
        };

        const markDelivery = async (orderId) => {
            const res = await updateOrderStatus(orderId, 'in-delivery');
            if (!res.error) closeOrderModal();
        };

        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
                case 'delivered': return 'bg-green-500/20 text-green-500 border-green-500/50';
                case 'received': return 'bg-green-500/20 text-green-500 border-green-500/50';
                case 'paid': return 'bg-green-200 text-green-500 border-green-500/50';
                case 'in-delivery': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
                case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
                case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/50';
                case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
                default: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
            }
        };

        return (
            <div className="flex flex-col h-full bg-black text-white">
                <NavHeader currentScreen="orders" onNavigate={onNavigate} user={user} cartItemCount={cartItemCount} />
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">ORDER <span className="text-yellow-500">HISTORY</span></h1>
                    {loading ? <div className="flex justify-center h-64 items-center"><Loader className="w-8 h-8" /></div> : 
                    orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-3xl">
                            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-bold">No past orders yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} onClick={() => openOrderModal(order)} className="cursor-pointer bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                                    <div className="bg-zinc-900/80 px-6 py-4 flex flex-wrap justify-between items-center border-b border-zinc-800">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order ID</p>
                                            <p className="font-mono text-sm text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                            {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Pending'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
                                            {order.order_items.map((item, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <div className="h-12 w-12 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                                                        <img src={getPublicProductImageUrl(item.products?.image_path)} alt="" className="max-h-full max-w-full" onError={(e) => e.target.style.display='none'}/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-bold text-white">{item.products?.name}</p>
                                                        <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                                        {item.product_size && <p className="text-xs text-zinc-400">Size: <span className="text-white font-bold">{item.product_size}</span></p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                                            <span className="text-zinc-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                                            <span className="text-xl font-black text-white">₱{order.total_amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Modal: Order Details */}
                            {modalOpen && selectedOrder && (
                                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-black/70" onClick={closeOrderModal}></div>
                                    <div className="relative w-full max-w-2xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 z-90">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-extrabold">Order #{selectedOrder.id.slice(0,8).toUpperCase()}</h3>
                                                <p className="text-sm text-zinc-400">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                            </div>
                                            <button onClick={closeOrderModal} className="p-2 text-zinc-400 hover:text-white"><X /></button>
                                        </div>
                                        <div className="divide-y divide-zinc-800">
                                            {selectedOrder.order_items.map((it, i) => (
                                                <div key={i} className="py-4 flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-zinc-950 rounded-lg p-2 flex items-center justify-center border border-zinc-800 overflow-hidden">
                                                        <img src={getPublicProductImageUrl(it.products?.image_path)} alt={it.products?.name} className="max-h-full max-w-full" onError={(e) => e.target.style.display='none'} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-white">{it.products?.name}</p>
                                                        <p className="text-xs text-zinc-400">Color: <span className="text-white font-bold">{it.products?.color || 'N/A'}</span></p>
                                                        <p className="text-xs text-zinc-400">Quantity: <span className="text-white font-bold">{it.quantity}</span></p>
                                                        {it.product_size && <p className="text-xs text-zinc-400">Size: <span className="text-white font-bold">{it.product_size}</span></p>}
                                                    </div>
                                                    <div className="text-sm text-zinc-300 text-right">
                                                        <p className={`px-3 py-1 rounded-full inline-block font-bold uppercase border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status ? (selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)) : 'Pending'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-end gap-3">
                                            {selectedOrder.status && selectedOrder.status.toLowerCase() === 'delivered' && (
                                                <button onClick={() => markReceived(selectedOrder.id)} disabled={modalLoading} className="py-2 px-4 bg-green-500 text-black font-bold rounded-md">Mark Received</button>
                                            )}

                                            {selectedOrder.status && selectedOrder.status.toLowerCase() === 'pending' && (
                                                <>
                                                    <button disabled className="py-2 px-4 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-bold rounded-md">⏳ Pending</button>
                                                    <button disabled className="py-2 px-4 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-bold rounded-md">⏳ Pending</button>
                                                </>
                                            )}

                                            {selectedOrder.status && selectedOrder.status.toLowerCase() === 'paid' && (
                                                <>
                                                    <button disabled className="py-2 px-4 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-bold rounded-md">⏳ Pending</button>
                                                    <button disabled className="py-2 px-4 bg-green-500 text-black font-bold rounded-md">✓ Paid</button>
                                                    <button onClick={() => cancelOrder(selectedOrder.id)} disabled={modalLoading} className="py-2 px-4 bg-red-600 text-white font-bold rounded-md">Cancel Order</button>
                                                </>
                                            )}

                                            {selectedOrder.status && selectedOrder.status.toLowerCase() === 'in-delivery' && (
                                                <>
                                                    <button disabled className="py-2 px-4 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-bold rounded-md">⏳ Pending</button>
                                                    <button onClick={() => markReceived(selectedOrder.id)} disabled={modalLoading} className="py-2 px-4 bg-green-500 text-black font-bold rounded-md">Delivered</button>
                                                </>
                                            )}

                                            {selectedOrder.status && selectedOrder.status.toLowerCase() === 'cancelled' && (
                                                <button disabled className="py-2 px-4 bg-zinc-800 text-zinc-400 font-bold rounded-md">Cancelled</button>
                                            )}

                                            {(!selectedOrder.status || (['processing','pending','paid','in-delivery','delivered','received','cancelled'].indexOf((selectedOrder.status||'').toLowerCase()) === -1)) && (
                                                <button onClick={() => cancelOrder(selectedOrder.id)} disabled={modalLoading} className="py-2 px-4 bg-red-600 text-white font-bold rounded-md">Cancel Order</button>
                                            )}

                                            <button onClick={closeOrderModal} className="py-2 px-4 bg-zinc-800 text-zinc-300 font-bold rounded-md">Close</button>
                                        </div>
                                        {modalMessage && <p className="mt-4 text-sm text-zinc-300">{modalMessage}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- SIMPLE SCREENS (Home, About, Login, Signup, Profile, Onboarding) ---
    // (Styling enhanced but logic largely same)

    const HomeScreen = ({ onNavigate, user, cartItemCount }) => (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
            {/* Background element */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black pointer-events-none"></div>
            <NavHeader currentScreen="home" onNavigate={onNavigate} user={user} cartItemCount={cartItemCount} />
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
                <div className="glass-panel p-10 rounded-3xl w-full max-w-md border-zinc-800/50">
                    <div className="inline-block p-4 bg-yellow-500 rounded-2xl mb-6 shadow-lg shadow-yellow-500/20 rotate-3 hover:rotate-6 transition-transform">
                        <Home className="w-10 h-10 text-black" />
                    </div>
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">EVO <span className="text-yellow-500">HELMETS</span></h1>
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">Ride with confidence. Premium gear for the modern rider.</p>
                    <button onClick={() => onNavigate('shop')} className="w-full py-4 px-6 rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-500/10">
                        START SHOPPING
                    </button>
                </div>
            </div>
        </div>
    );

    const AboutScreen = ({ onNavigate, user, cartItemCount }) => (
        <div className="flex flex-col h-full bg-black text-white">
            <NavHeader currentScreen="about" onNavigate={onNavigate} user={user} cartItemCount={cartItemCount} />
            <div className="flex-grow p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-6">About <span className="text-yellow-500">EVO</span></h1>
                <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                    Born from a passion for the open road, EVO Helmets is dedicated to providing riders with top-tier protection without compromising on style. We believe safety should look as good as it feels.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-12">
                    <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center flex-col">
                        <Mail className="w-8 h-8 text-yellow-500 mb-3"/>
                        <p className="font-bold">support@evo.com</p>
                    </div>
                    <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center flex-col">
                        <Phone className="w-8 h-8 text-yellow-500 mb-3"/>
                        <p className="font-bold">+1 (555) EVO-RIDE</p>
                    </div>
                </div>
                <button onClick={() => onNavigate('shop')} className="px-8 py-3 rounded-full border-2 border-yellow-500 text-yellow-500 font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
                    View Collection
                </button>
            </div>
        </div>
    );

    const LoginScreen = ({ onNavigate, onLogin }) => {
        const [formData, setFormData] = useState({ email: "", password: "" });
        const [loading, setLoading] = useState(false);
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!supabase) return;
            setLoading(true);
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
                if (error) throw error;
                onLogin(data.user);
            } catch (error) {
                console.error('Login Error:', error.message);
                // In a real app, use a toast here. For now, we rely on console or passed down error handler if we had one easily accessible.
                alert(error.message); // Fallback
            } finally { setLoading(false); }
        };
        return (
            <div className="flex flex-col h-full bg-black">
                <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 max-w-md mx-auto w-full">
                    <button onClick={() => onNavigate('home')} className="self-start mb-8 p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition"><ArrowLeft /></button>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">WELCOME <span className="text-yellow-500">BACK</span></h2>
                    <p className="text-zinc-400 mb-10">Sign in to continue your ride.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={Mail} />
                        <InputField name="password" type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} icon={Lock} />
                        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                            {loading ? <Loader /> : 'LOG IN'}
                        </button>
                    </form>
                    <p className="text-center text-zinc-500 mt-8">
                        New to EVO? <button onClick={() => onNavigate('signup')} className="text-yellow-500 font-bold hover:underline ml-1">Create Account</button>
                    </p>
                </div>
            </div>
        );
    };

    const SignupScreen = ({ onNavigate, onSignup }) => {
        const [formData, setFormData] = useState({ firstName: "", lastName: "", age: "", username: "", phone: "", email: "", password: "" });
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!supabase) return;
            setLoading(true);
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: { data: { full_name: `${formData.firstName} ${formData.lastName}`, username: formData.username } }
                });
                if (error) throw error;
                if (data.user) {
                    await supabase.from('profiles').update({ age: parseInt(formData.age), phone: formData.phone, full_name: `${formData.firstName} ${formData.lastName}` }).eq('id', data.user.id);
                    onSignup(data.user);
                }
            } catch (error) { alert(error.message); } finally { setLoading(false); }
        };

        return (
            <div className="flex flex-col h-full bg-black">
                <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 max-w-lg mx-auto w-full overflow-y-auto">
                    <button onClick={() => onNavigate('login')} className="self-start mb-6 p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition"><ArrowLeft /></button>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">JOIN THE <span className="text-yellow-500">CREW</span></h2>
                    <p className="text-zinc-400 mb-8">Create your account to get started.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-4"><InputField name="firstName" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="flex-1 !mb-0" required /><InputField name="lastName" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="flex-1 !mb-0" required /></div>
                        <div className="flex gap-4"><InputField name="age" type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} icon={Cake} className="flex-1 !mb-0" required /><InputField name="username" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} icon={User} className="flex-1 !mb-0" required /></div>
                        <InputField name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} icon={Phone} required={false} />
                        <InputField name="email" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={Mail} />
                        <InputField name="password" type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} icon={Lock} />
                        <button type="submit" disabled={loading} className="w-full py-4 mt-4 rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-all flex justify-center">
                            {loading ? <Loader /> : 'CREATE ACCOUNT'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const ProfileScreen = ({ user, onNavigate, onLogout, cartItemCount }) => {
        const [profile, setProfile] = useState(null);
        const [isEditing, setIsEditing] = useState(false);
        const [editData, setEditData] = useState({});
        const [loading, setLoading] = useState(false); // Added loading state for profile save

        useEffect(() => {
            if (user && supabase) {
                supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
                    if (data) { setProfile(data); setEditData(data); }
                });
            }
        }, [user]);

        const handleSave = async () => {
            if (!supabase || !user) return;
            setLoading(true);
            await supabase.from('profiles').update({ address: editData.address, phone: editData.phone }).eq('id', user.id);
            setProfile(editData);
            setIsEditing(false);
            setLoading(false);
        };

        return (
            <div className="flex flex-col h-full bg-black text-white">
                <NavHeader currentScreen="profile" onNavigate={onNavigate} user={user} cartItemCount={cartItemCount} />
                <div className="flex-grow p-6 overflow-y-auto">
                    <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-3xl p-8 flex flex-col items-center text-center mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none"/>
                        <div className="w-24 h-24 bg-zinc-800 rounded-full border-4 border-yellow-500 flex items-center justify-center mb-4 relative z-10 shadow-xl shadow-yellow-500/20">
                            <User className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight relative z-10">{profile?.full_name || 'Rider'}</h2>
                        <p className="text-zinc-500 relative z-10">@{profile?.username}</p>
                    </div>

                    <div className="space-y-6 max-w-xl mx-auto">
                        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 flex items-center"><MapPin className="w-4 h-4 mr-2 text-yellow-500"/> Shipping Address</h3>
                                {!isEditing && <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-yellow-500 hover:underline">EDIT</button>}
                            </div>
                            {isEditing ? (
                                <InputField isTextArea name="address" value={editData.address || ''} onChange={(e) => setEditData({...editData, address: e.target.value})} placeholder="Enter full address" required={false} className="!mb-0" />
                            ) : <p className="text-white font-medium leading-relaxed">{profile?.address || 'No address set.'}</p>}
                        </div>

                        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 flex items-center"><Phone className="w-4 h-4 mr-2 text-yellow-500"/> Contact Phone</h3>
                            </div>
                            {isEditing ? (
                                <InputField name="phone" value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} placeholder="Enter phone number" icon={Phone} required={false} className="!mb-0" />
                            ) : <p className="text-white font-medium">{profile?.phone || 'No phone set.'}</p>}
                        </div>

                        {isEditing && (
                            <div className="flex gap-4 mt-6">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition">CANCEL</button>
                                <button onClick={handleSave} disabled={loading} className="flex-1 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition flex justify-center">
                                    {loading ? <Loader className="text-black"/> : 'SAVE CHANGES'}
                                </button>
                            </div>
                        )}

                        {!isEditing && (
                            <div className="pt-8 space-y-3">
                                <button onClick={() => onNavigate('orders')} className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 hover:border-zinc-600 transition">MY ORDERS</button>
                                <button onClick={onLogout} className="w-full py-4 bg-red-950/30 text-red-500 border border-red-900/50 rounded-xl font-bold uppercase tracking-widest hover:bg-red-900/50 transition">LOG OUT</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const OnboardingScreen = ({ onNavigate }) => {
        const [step, setStep] = useState(1);
        return (
            <div className="h-full flex flex-col bg-black text-white relative overflow-hidden">
                {/* Creative Background */}
                <div className={`absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-600/20 via-black to-black ${step === 1 ? 'opacity-100' : 'opacity-0'}`}/>
                <div className={`absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-black to-black ${step === 2 ? 'opacity-100' : 'opacity-0'}`}/>
                <div className={`absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-black to-black ${step === 3 ? 'opacity-100' : 'opacity-0'}`}/>

                <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="w-full max-w-md text-center">
                        <div className="h-64 sm:h-80 mb-12 relative flex items-center justify-center">
                            {/* Simulated Image Placeholder with Animation */}
                            <div key={step} className="animate-fadeIn transition-all duration-500 transform scale-100">
                                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-zinc-900/50 rounded-full border-2 border-yellow-500/30 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-yellow-500/10 backdrop-blur-md">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/5 to-transparent animate-pulse"></div>
                                    <span className="text-zinc-700 font-black text-6xl sm:text-8xl opacity-50 select-none">{step}</span>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4">
                            {step === 1 && <>Ride <span className="text-yellow-500">Safe</span></>}
                            {step === 2 && <>Ride <span className="text-blue-500">Fast</span></>}
                            {step === 3 && <>Ride <span className="text-red-500">EVO</span></>}
                        </h2>
                        <p className="text-zinc-400 text-lg px-8">
                            {step === 1 && "Top-tier protection for every journey you take."}
                            {step === 2 && "Aerodynamic designs built for speed and comfort."}
                            {step === 3 && "Join the community of elite riders today."}
                        </p>
                    </div>
                </div>
                <div className="p-8 sm:p-12 relative z-10">
                    <div className="flex justify-center space-x-3 mb-8">
                        {[1, 2, 3].map(i => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-yellow-500' : 'w-2 bg-zinc-800'}`} />)}
                    </div>
                    <button onClick={() => step < 3 ? setStep(step + 1) : onNavigate('login')} className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-yellow-500 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl">
                        {step < 3 ? 'NEXT' : 'GET STARTED'}
                    </button>
                </div>
            </div>
        );
    };

    // --- MAIN APP ---
    const App = () => {
        const [screen, setScreen] = useState('onboarding');
        const [user, setUser] = useState(null);
        const [message, setMessage] = useState(null);
        const [cartItems, setCartItems] = useState([]);
        const [selectedCartItems, setSelectedCartItems] = useState([]);
        const [orderSummary, setOrderSummary] = useState(null);

        const handleNavigate = (s, p = {}) => { 
            if (s === 'message') setMessage(p);
            else if (s === 'checkout') { setOrderSummary(p); setScreen('checkout'); }
            else setScreen(s);
        };

        // --- Cart Logic (Simplified for brevity but fully functional based on previous) ---
        const fetchCart = async (uid) => {
            if (!supabase || !uid) return;
            const { data } = await supabase.from('cart_items').select('product_id, quantity, size, products (id, name, price, image_path, color)').eq('user_id', uid);
            setCartItems(data || []);
            // Retain selection if possible, else select all new if cart was empty before
            setSelectedCartItems(prev => (data || []).filter(item => prev.some(p => p.product_id === item.product_id && p.size === item.size)));
            if (selectedCartItems.length === 0 && (data || []).length > 0) setSelectedCartItems(data || []);
        };
        const addToCart = async (product, size) => {
            if (!user) { handleNavigate('message', { message: 'Please log in.', type: 'error' }); return; }
            const existing = cartItems.find(i => i.product_id === product.id && i.size === size);
            const { error } = await supabase.from('cart_items').upsert({ user_id: user.id, product_id: product.id, size, quantity: (existing?.quantity || 0) + 1 }, { onConflict: 'user_id, product_id, size' });
            if (!error) { await fetchCart(user.id); handleNavigate('message', { message: 'Added to cart!', type: 'success' }); }
        };
        const updateQuantity = async (pid, size, qty) => {
            if (qty <= 0) { await removeFromCart(pid, size); return; }
            await supabase.from('cart_items').update({ quantity: qty }).match({ user_id: user.id, product_id: pid, size });
            fetchCart(user.id);
        };
        const removeFromCart = async (pid, size) => {
            await supabase.from('cart_items').delete().match({ user_id: user.id, product_id: pid, size });
            fetchCart(user.id);
        };
        const toggleItemSelection = (pid, size) => {
            const item = cartItems.find(i => i.product_id === pid && i.size === size);
            if (!item) return;
            setSelectedCartItems(prev => prev.some(i => i.product_id === pid && i.size === size) ? prev.filter(i => !(i.product_id === pid && i.size === size)) : [...prev, item]);
        };

      // This assumes you are in a component that has access to the useStripe() hook 
// or that you pass the stripe object in, as stripe.handleNextAction is a client-side method.
// I will assume you can access `stripe` and `elements` from a hook (e.g., useStripe, useElements) 
// or that you will pass it into the CheckoutScreen which then passes it to placeOrder.
// If you are using <Elements> higher up, you need to ensure `stripe` is available here.

const placeOrder = async (total, address, payment, items, clientSecret, stripe) => {
    // Variable for the backend URL (fix for "Failed to fetch")
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    if (!SERVER_URL) {
        handleNavigate('message', { message: 'Configuration Error: VITE_SERVER_URL is missing.', type: 'error' });
        return false;
    }
    
    let paymentIntentId = null;
    let paymentStatus = null;
    let computedStatus = 'pending';
    
    try {
        // ====================================================
        // A. Confirm Payment with Stripe on Server
        // ====================================================
        
        // This is a common way to get a payment method ID when using PaymentElement
        // However, since we are confirming server-side, we must pass the data to the server.
        // Assuming the payment method for this flow is the one used to create the intent
        const last4 = clientSecret.substring(clientSecret.length - 4);
        const paymentMethodId = `pm_card_${last4}`; 

        // 1. Call your backend server to confirm the payment
        const confirmResponse = await fetch(`${SERVER_URL}/confirm-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                paymentIntentId: clientSecret, 
                paymentMethodId: paymentMethodId,
            }),
        });

        const confirmData = await confirmResponse.json();
        
        if (!confirmResponse.ok) {
             throw new Error(confirmData.message || "Server error during payment confirmation.");
        }
        
        const paymentIntent = confirmData.paymentIntent;
        paymentIntentId = paymentIntent.id;
        paymentStatus = paymentIntent.status;

        // 2. Handle 3D Secure / Action Required
        if (paymentIntent.status === 'requires_action' && paymentIntent.next_action) {
            
            handleNavigate('message', { message: 'Awaiting 3D Secure authentication...', type: 'info' });
            
            // Execute the client-side action (redirect or popup for authentication)
            const { error: actionError, paymentIntent: updatedPaymentIntent } = 
                await stripe.handleNextAction({ clientSecret: paymentIntent.client_secret });
            
            if (actionError) {
                // Customer failed 3D Secure or cancelled
                throw new Error(actionError.message || '3D Secure authentication failed.');
            }
            
            // Update status after successful authentication
            paymentStatus = updatedPaymentIntent.status;
            
            if (paymentStatus !== 'succeeded') {
                throw new Error(`Payment failed after authentication. Status: ${paymentStatus}`);
            }
        }
        
        if (paymentStatus !== 'succeeded') {
            throw new Error(`Payment status is ${paymentStatus}. Cannot place order.`);
        }


        // ====================================================
        // B. Save Order to Supabase (Existing Logic)
        // ====================================================
        
        // Normalize incoming payment status and set a canonical order status (lowercase)
        const normalizedPaymentStatus = paymentStatus ? String(paymentStatus).toLowerCase() : null;
        
        if (normalizedPaymentStatus === 'succeeded' || normalizedPaymentStatus === 'paid') computedStatus = 'paid';
        
        // Build the order payload
        const basePayload = {
            user_id: user.id,
            total_amount: total,
            shipping_address: address,
            payment_method: payment,
            status: computedStatus
        };
        // Use the IDs and status received from Stripe
        if (paymentIntentId) basePayload.payment_intent_id = paymentIntentId;
        if (normalizedPaymentStatus) basePayload.payment_status = normalizedPaymentStatus;

        // Helper to attempt insert and optionally retry without Stripe fields if schema lacks them
        const tryInsertOrder = async (payload) => {
            const { data, error } = await supabase.from('orders').insert(payload).select().single();
            return { data, error };
        };

        // First attempt: try inserting full payload
        let { data: order, error: oErr } = await tryInsertOrder(basePayload);

        // If the DB reports missing column(s) for payment fields, retry without them
        if (oErr && /payment_intent_id|payment_status|column .* does not exist/i.test(oErr.message || '')) {
            const safePayload = { ...basePayload };
            delete safePayload.payment_intent_id;
            delete safePayload.payment_status;
            const retry = await tryInsertOrder(safePayload);
            order = retry.data;
            oErr = retry.error;
        }

        if (oErr) throw oErr;

        const { error: iErr } = await supabase.from('order_items').insert(items.map(i => ({ order_id: order.id, product_id: i.product_id, quantity: i.quantity, product_size: i.size, price_at_purchase: i.products.price })));
        if (iErr) throw iErr;

        await Promise.all(items.map(i => supabase.from('cart_items').delete().match({ user_id: user.id, product_id: i.product_id, size: i.size })));
        await fetchCart(user.id);
        handleNavigate('message', { message: 'Payment successful and order placed!', type: 'success' });
        return true;
    } catch (e) {
        // If an error occurred in either Stripe confirmation or Supabase insertion
        console.error("Order or Payment Failure:", e);
        handleNavigate('message', { message: e.message || 'Payment failed or order could not be placed.', type: 'error' });
        return false;
    }
};

        useEffect(() => {
            if (!supabase) { setScreen('home'); return; }
            supabase.auth.getSession().then(({ data: { session } }) => { if (session) { setUser(session.user); fetchCart(session.user.id); setScreen('home'); }});
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session) { setUser(session.user); fetchCart(session.user.id); }
                else { setUser(null); setCartItems([]); setSelectedCartItems([]); setScreen('home'); }
            });
            return () => subscription.unsubscribe();
        }, []);

        return (
            <div className="h-screen bg-black text-white antialiased">
                <AppStyles />
                {screen === 'onboarding' && <OnboardingScreen onNavigate={handleNavigate} />}
                {screen === 'home' && <HomeScreen onNavigate={handleNavigate} user={user} cartItemCount={cartItems.length} />}
                {screen === 'shop' && <ShopScreen onNavigate={handleNavigate} addToCart={addToCart} user={user} cartItemCount={cartItems.length} />}
                {screen === 'cart' && <CartScreen onNavigate={handleNavigate} cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} user={user} selectedCartItems={selectedCartItems} toggleItemSelection={toggleItemSelection} toggleSelectAll={(c) => setSelectedCartItems(c ? cartItems : [])} />}
                {screen === 'checkout' && <CheckoutScreen onNavigate={handleNavigate} user={user} orderSummary={orderSummary} placeOrder={placeOrder} />}
                {screen === 'orders' && <OrderHistoryScreen user={user} onNavigate={handleNavigate} cartItemCount={cartItems.length} />}
                {screen === 'profile' && <ProfileScreen user={user} onNavigate={handleNavigate} onLogout={() => supabase.auth.signOut()} cartItemCount={cartItems.length} />}
                {screen === 'login' && <LoginScreen onNavigate={handleNavigate} onLogin={() => { setScreen('home'); }} />}
                {screen === 'signup' && <SignupScreen onNavigate={handleNavigate} onSignup={() => { setScreen('home'); }} />}
                {screen === 'about' && <AboutScreen onNavigate={handleNavigate} user={user} cartItemCount={cartItems.length} />}
                <MessageModal message={message?.message} type={message?.type} onClose={() => setMessage(null)} />
            </div>
        );
    };

    export default App;