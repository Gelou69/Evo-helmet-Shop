// App.jsx (Example)
import { Routes, Route } from 'react-router-dom';
// Import your components
import Admin from './admin/admin.jsx';
import User from './user/user.jsx';
import "tailwindcss";

function App() {
  return (
    <Routes>
      {/* Route 1: Renders the User component for the root path and /user */}
      <Route path="/" element={<User />} />
      <Route path="/user" element={<User />} />

      {/* Route 2: Renders the Admin component for /admin */}
      <Route path="/admin" element={<Admin />} />

      {/* Optional: Add a 404/Not Found route */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;