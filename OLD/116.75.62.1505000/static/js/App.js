import React from 'react';
import {
    BrowserRouter,
    BrowserRouter as RouterProvider
} from 'react-router-dom';
import AppRouter from "./routes/AppRouter.tsx";
import {
    Provider
} from 'react-redux';
import store from './store/store.js';
import './App.css';
import {
    DateLimitProvider
} from './utils/dateLimits.js';


const App = () => {
    return (

        // <RouterProvider>
        //    <div className="App">
        <
        Provider store = {
            store
        } >
        <
        DateLimitProvider >
        <
        BrowserRouter >
        <
        AppRouter / >
        <
        /BrowserRouter> <
        /DateLimitProvider> <
        /Provider>
        //   </div>
        // </RouterProvider>
    );
};

export default App;