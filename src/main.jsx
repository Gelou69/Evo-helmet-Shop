import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Admin from './admin/admin.jsx';
import User from './user/user.jsx';
import "tailwindcss";

// Multi-page LoadingScreen component
function LoadingScreen({ onComplete }) {
	const [currentPage, setCurrentPage] = React.useState(0);

	const pages = [
		{
			title: "Welcome to Evo Helmet Shop",
			description: "Discover premium quality helmets for your safety",
			image: "/logo.jpg"
		},
		{
			title: "Quality & Safety",
			description: "All our helmets meet international safety standards",
			image: "/logo.jpg"
		},
		{
			title: "Get Started",
			description: "Browse our collection and find your perfect helmet",
			image: "/logo.jpg"
		}
	];

	const handleNext = () => {
		if (currentPage < pages.length - 1) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handleOrderNow = () => {
		onComplete();
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
			<div className="flex flex-col items-center justify-center space-y-8">
				<img src={pages[currentPage].image} alt="Logo" className="w-40 h-40 animate-bounce" />
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-800 mb-3">{pages[currentPage].title}</h1>
					<p className="text-xl text-gray-600">{pages[currentPage].description}</p>
				</div>

				{/* Progress Dots */}
				<div className="flex space-x-3">
					{pages.map((_, index) => (
						<div
							key={index}
							className={`h-3 w-3 rounded-full transition-all ${
								index === currentPage ? 'bg-blue-600 w-8' : 'bg-gray-300'
							}`}
						/>
					))}
				</div>

				{/* Buttons */}
				<div className="flex gap-4">
					{currentPage < pages.length - 1 ? (
						<button
							onClick={handleNext}
							className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
						>
							Next
						</button>
					) : (
						<button
							onClick={handleOrderNow}
							className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
						>
							Order Now
						</button>
					)}
				</div>

				{/* Page Counter */}
				<p className="text-gray-600 text-sm">
					Page {currentPage + 1} of {pages.length}
				</p>
			</div>
		</div>
	);
}

function MainApp() {
	const [loading, setLoading] = React.useState(true);

	const handleLoadingComplete = () => {
		setLoading(false);
	};

	if (loading) {
		return <LoadingScreen onComplete={handleLoadingComplete} />;
	}

	// showAdmin controls whether admin UI is shown as an overlay while keeping the URL at root
	const [showAdmin, setShowAdmin] = React.useState(false);

	// Wrapper component that injects react-router's navigate into User
	function UserWrapper() {
		const navigate = useNavigate();
		const navigateTo = (path) => {
			if (path === '/admin') {
				// Open admin as an in-page overlay instead of navigating to /admin
				setShowAdmin(true);
			} else {
				navigate(path);
			}
		};
		return <User navigateTo={navigateTo} />;
	}

	function AdminModal({ onClose }) {
		return (
			<div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)' }}>
				<div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10001 }}>
					<button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8, background: '#111', color: '#fff', border: '1px solid #333' }}>Close Admin</button>
				</div>
				<div style={{ position: 'absolute', inset: '40px', overflow: 'auto', zIndex: 10000 }}>
					<Admin />
				</div>
			</div>
		);
	}

	return (
		<BrowserRouter>
			<Routes>
				{/* User Routes */}
				<Route path="/" element={<UserWrapper />} />
				<Route path="/user" element={<UserWrapper />} />
				{/* Admin Route (kept for compatibility but not required) */}
				<Route path="/admin" element={<Admin />} />
				{/* 404 Not Found */}
				<Route 
					path="*" 
					element={
						<div className="flex items-center justify-center h-screen bg-black text-white">
							<div className="text-center">
								<h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
								<p className="text-xl text-gray-400">Page Not Found</p>
								<a 
									href="/" 
									className="mt-6 inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
								>
									Go Home
								</a>
							</div>
						</div>
					} 
				/>
			</Routes>
			{showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
		</BrowserRouter>
	);
}

// Simple Error Boundary to catch runtime errors and print useful info to the UI/console
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, info: null };
	}
	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}
	componentDidCatch(error, info) {
		console.error('Captured error in ErrorBoundary:', error, info);
		this.setState({ info });
	}
	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: 20, color: 'white', background: '#111', minHeight: '100vh' }}>
					<h1 style={{ color: '#f00' }}>Application Error</h1>
					<pre style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>{String(this.state.error && this.state.error.message)}</pre>
					<details style={{ color: '#ddd' }}>
						{(this.state.info && this.state.info.componentStack) || 'No component stack available.'}
					</details>
					<p>Open the dev console for more details. If this happens in production, run locally in dev mode to see full React error.</p>
				</div>
			);
		}
		return this.props.children;
	}
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ErrorBoundary>
			<MainApp />
		</ErrorBoundary>
	</React.StrictMode>
);