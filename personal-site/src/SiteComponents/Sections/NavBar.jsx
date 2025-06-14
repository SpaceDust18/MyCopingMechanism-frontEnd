import { Link } from "react-router-dom";

export default function NavBar({ authUser, setAuthUser, setToken }) {
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setAuthUser(null);
        setToken(null);
    };

    return (
        <nav className="navbar">
            <Link to="/register">Register</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {authUser && <Link to="/blog">Blog</Link>}
            {authUser && <Link to="/comments">Comments</Link>}
            {/* Add other links as needed */}

            <div className="auth-controls">
                {authUser ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    )
}


