// Signup.js
import React from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';
import logouges from '../../assets/l1.jpg'


const Signup = () => {
    return ( <
        Container maxWidth = "sm" >
        <
        Box sx = {
            {
                display: 'flex',
                justifyContent: 'center',
                mt: 4
            }
        } >
        <
        img src = {
            logouges
        }
        alt = "WTG Logo"
        style = {
            {
                height: 100,
                objectFit: 'contain'
            }
        }
        /> <
        /Box> <
        Typography variant = "body1"
        align = "center"
        color = "text.secondary"
        sx = {
            {
                mt: 1
            }
        } >
        New user ? Please fill in the form below to register. <
        /Typography> <
        Paper elevation = {
            3
        }
        sx = {
            {
                padding: 4,
                marginTop: 4
            }
        } >

        <
        Typography variant = "h5"
        align = "center"
        gutterBottom >
        Sign Up <
        /Typography> <
        Box component = "form"
        noValidate autoComplete = "off" >
        <
        TextField fullWidth margin = "normal"
        label = "Name"
        type = "text"
        variant = "outlined" /
        >
        <
        TextField fullWidth margin = "normal"
        label = "Email"
        type = "email"
        variant = "outlined" /
        >
        <
        TextField fullWidth margin = "normal"
        label = "Password"
        type = "password"
        variant = "outlined" /
        >
        <
        Button fullWidth variant = "contained"
        color = "primary"
        sx = {
            {
                mt: 2
            }
        } >
        Sign Up <
        /Button> <
        Typography variant = "body2"
        align = "center"
        sx = {
            {
                mt: 2
            }
        } >
        Already have an account ? < a href = "/" > Login < /a> <
        /Typography> <
        /Box> <
        /Paper> <
        /Container>
    );
};

export default Signup;