import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Divider,
    IconButton,
    Chip,
} from "@mui/material";
import {
    Email,
    LocationOn,
    Facebook,
    LinkedIn,
    Instagram,
    Twitter,
} from "@mui/icons-material";
import logoft from "../../assets/image.jpg"


export default function Footer() {
    return ( <
        Box sx = {
            {
                width: "100%",
                backgroundColor: "#1a365d", // Deep blue instead of dark blue
                color: "#fff",
                py: 4,
                mt: 4,
                borderTop: "3px solid",
                // borderImage: "linear-gradient(135deg, #00e676 0%, #00b248 100%) 1",
                background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
            }
        } >
        <
        Container maxWidth = "lg" >
        <
        Grid container spacing = {
            4
        } > { /* Logo & Info */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                mb: 2
            }
        } >
        <
        Box component = "img"
        src = {
            logoft
        }
        alt = "UGES Logo"
        sx = {
            {
                width: 100,
                height: 60,
                mr: 2,
                borderRadius: 1,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
            }
        }
        /> <
        Box >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: "bold",
                background: "linear-gradient(135deg, #00e676 0%, #00b248 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
            }
        } >
        UGES PowerMax Pvt.Ltd. <
        /Typography> <
        Chip label = "Performance & Sustainability Partner"
        size = "small"
        sx = {
            {
                mt: 1,
                backgroundColor: "rgba(0, 230, 118, 0.1)",
                color: "#00e676",
                fontWeight: 500,
                fontSize: "0.7rem",
            }
        }
        /> <
        /Box> <
        /Box>

        <
        Typography variant = "body2"
        sx = {
            {
                color: "#e2e8f0",
                mb: 2,
                lineHeight: 1.6
            }
        } >
        Begin your renewable journey with < strong style = {
            {
                color: "#00e676"
            }
        } > UGES < /strong>.
        We provide sustainable energy solutions
        for a greener future. <
        /Typography>

        { /* Social Media Icons */ } <
        Box sx = {
            {
                mt: 3
            }
        } > {
            [{
                    icon: < Facebook / > ,
                    href: "https://www.facebook.com"
                },
                {
                    icon: < LinkedIn / > ,
                    href: "https://www.linkedin.com"
                },
                {
                    icon: < Instagram / > ,
                    href: "https://www.instagram.com"
                },
                {
                    icon: < Twitter / > ,
                    href: "https://twitter.com"
                },
            ].map((social, index) => ( <
                IconButton key = {
                    index
                }
                href = {
                    social.href
                }
                target = "_blank"
                sx = {
                    {
                        color: "#cbd5e0",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        mr: 1,
                        mb: 1,
                        "&:hover": {
                            backgroundColor: "#01b15cff",
                            color: "#1a365d",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0, 230, 118, 0.3)"
                        },
                        transition: "all 0.3s ease",
                    }
                } >
                {
                    social.icon
                } <
                /IconButton>
            ))
        } <
        /Box> <
        /Grid>

        { /* Services */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        }
        md = {
            4
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                fontWeight: 700,
                color: "#00e676",
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    backgroundColor: "#00e676",
                    borderRadius: 2
                }
            }
        } >
        Our Services <
        /Typography> <
        Box sx = {
            {
                display: "flex",
                flexDirection: "column",
                gap: 1
            }
        } > {
            [
                "Feasibility Study",
                "Design Services",
                "Owner's Engineering Services",
                "Project Handing Over",
                "Asset Management",
                "Inspection & Testing",
            ].map((service) => ( <
                Box key = {
                    service
                }
                sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            transform: "translateX(5px)",
                            color: "#00e676"
                        }
                    }
                } >
                <
                Box sx = {
                    {
                        width: 6,
                        height: 6,
                        backgroundColor: "#00e676",
                        borderRadius: "50%",
                        mr: 1.5,
                        flexShrink: 0
                    }
                }
                /> <
                Typography variant = "body2"
                sx = {
                    {
                        color: "#e2e8f0",
                        cursor: "pointer",
                        "&:hover": {
                            color: "#00e676"
                        }
                    }
                } >
                {
                    service
                } <
                /Typography> <
                /Box>
            ))
        } <
        /Box> <
        /Grid>

        { /* Contact Info */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        }
        md = {
            4
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                fontWeight: 700,
                color: "#00e676",
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    backgroundColor: "#00e676",
                    borderRadius: 2
                }
            }
        } >
        Contact Us <
        /Typography>

        <
        Box sx = {
            {
                display: "flex",
                alignItems: "flex-start",
                mb: 2
            }
        } >
        <
        LocationOn sx = {
            {
                mr: 1.5,
                mt: "2px",
                color: "#00e676",
                flexShrink: 0
            }
        }
        /> <
        Typography variant = "body2"
        sx = {
            {
                color: "#e2e8f0",
                lineHeight: 1.5
            }
        } >
        B - 4, Pentagone Tower, Near Cummings College, Karve Nagar Pune - 41146. MH.India <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                display: "flex",
                alignItems: "flex-start",
                mb: 2
            }
        } >
        <
        LocationOn sx = {
            {
                mr: 1.5,
                mt: "2px",
                color: "#00e676",
                flexShrink: 0
            }
        }
        /> <
        Typography variant = "body2"
        sx = {
            {
                color: "#e2e8f0",
                lineHeight: 1.5
            }
        } >
        Regd.Office: 315, Lotus Aura - 2, Sama Savli Road Vemali, Vadodara 390008, Guj.India <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                mb: 1.5
            }
        } >
        <
        Email sx = {
            {
                mr: 1.5,
                color: "#00e676",
                flexShrink: 0
            }
        }
        /> <
        Link href = "mailto:Enquiry@uges.co.in"
        underline = "hover"
        sx = {
            {
                color: "#e2e8f0",
                "&:hover": {
                    color: "#00e676",
                    textDecoration: "none"
                }
            }
        } >
        Enquiry @uges.co.in <
        /Link> <
        /Box>

        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center"
            }
        } >
        <
        Box component = "span"
        sx = {
            {
                width: 24,
                height: 24,
                mr: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00e676",
                fontWeight: "bold",
                fontSize: "0.8rem"
            }
        } >
        🌐
        <
        /Box> <
        Link href = "https://www.uges.co.in"
        target = "_blank"
        underline = "hover"
        sx = {
            {
                color: "#e2e8f0",
                "&:hover": {
                    color: "#00e676",
                    textDecoration: "none"
                }
            }
        } >
        www.uges.co.in <
        /Link> <
        /Box> <
        /Grid> <
        /Grid>

        <
        Divider sx = {
            {
                my: 4,
                backgroundColor: "rgba(0, 230, 118, 0.3)",
                height: 1
            }
        }
        />

        { /* Bottom Section */ } <
        Box textAlign = "center"
        sx = {
            {
                padding: 2,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: 1,
                border: "1px solid rgba(255, 255, 255, 0.1)"
            }
        } >
        <
        Typography variant = "body2"
        sx = {
            {
                color: "#a0aec0"
            }
        } > ©{
            new Date().getFullYear()
        }
        UGES PowerMax Pvt.Ltd. | All Rights Reserved <
        /Typography> <
        Typography variant = "caption"
        sx = {
            {
                color: "#718096",
                mt: 1,
                display: "block"
            }
        } >
        Committed to Sustainable Energy Solutions <
        /Typography> <
        /Box> <
        /Container> <
        /Box>
    );
}