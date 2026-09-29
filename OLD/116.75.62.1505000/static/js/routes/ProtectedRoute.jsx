import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

    if (isAuthenticated && !user) {
        return null;
    }
    // if (loading) return null;
    // not logged in
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // role not allowed
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
