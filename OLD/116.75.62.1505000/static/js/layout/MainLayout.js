import React, {
    useEffect
} from "react";

import Navbar from "../components/Nav/Navbar";

import {
    useDispatch
} from "react-redux";

import {
    Outlet
} from "react-router-dom";

import Footer from "../components/Nav/Footer";

import {
    GetNotifications
} from "../Redux/DashboardData/dashboardAction";

import {
    useLocation
} from "react-router-dom";

const MainLayout = () => {
    const location = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetNotifications());
    }, [location.pathname, dispatch]);

    return ( <
        div style = {
            {
                display: "flex",

                flexDirection: "column",

                minHeight: "100vh",
            }
        } >
        { /* Top Navbar */ } <
        Navbar / >

        { /* Page Content */ } <
        div style = {
            {
                flex: 1,
                padding: "16px"
            }
        } >
        <
        Outlet / >
        <
        /div>

        { /* Footer at bottom */ } <
        Footer / >
        <
        /div>
    );
};

export default MainLayout;