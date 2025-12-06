import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './admin/admin.jsx';
import User from './user/user.jsx';
import "tailwindcss";
// LoadingScreen component
function LoadingScreen() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-white">
			<img src="/logo.jpg" alt="Logo" className="w-32 h-32 mb-6 animate-bounce" />
			<h2 className="text-2xl font-bold text-gray-700">Loading...</h2>
		</div>
	);
}

function MainApp() {
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds
		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<BrowserRouter>
			<Routes>
				{/* User Routes */}
				<Route path="/" element={<User />} />
				<Route path="/user" element={<User />} />
				{/* Admin Route */}
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
		</BrowserRouter>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<MainApp />
	</React.StrictMode>
);