import {
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

function Loader({
    text = "Loading data..."
}) {
    return ( <
        Box sx = {
            {
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }
        } >
        <
        CircularProgress / >
        <
        Typography variant = "body2"
        color = "text.secondary" > {
            text
        } <
        /Typography> <
        /Box>
    );
}

export default Loader;