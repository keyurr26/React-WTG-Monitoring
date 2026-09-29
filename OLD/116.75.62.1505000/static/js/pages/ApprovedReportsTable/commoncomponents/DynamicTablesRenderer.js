import {
    Box,
    Container
} from "@mui/material";
import DynamicTable from "./DynamicTable";
import Loader from "../commoncomponents/Loader";

function DynamicTablesRenderer({
    tables,
    onApprove,
    loading,
    error,
    onUpdate,
    sqlist,
    delays
}) {

    // console.log("road table",tables)
    const hasData =
        tables &&
        tables.length > 0 &&
        tables.some((table) => table.rows && table.rows.length > 0);


    if (loading && !hasData) {
        return <Loader / > ;
    }


    if (!tables || tables.length === 0) return null;

    return ( <
        Container maxWidth = {
            false
        }
        sx = {
            {
                px: 3
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                flexDirection: "column",
                gap: 4,
                py: 3,
            }
        } >
        {
            tables.map((table, index) => ( <
                Box key = {
                    table.id || index
                }
                sx = {
                    {
                        animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                        "@keyframes fadeInUp": {
                            from: {
                                opacity: 0,
                                transform: "translateY(20px)"
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)"
                            },
                        },
                    }
                } >
                <
                DynamicTable tableId = {
                    table.id
                }
                title = {
                    table.title
                }
                columns = {
                    table.columns
                }
                rows = {
                    table.rows
                }
                onApprove = {
                    onApprove
                }
                onUpdate = {
                    onUpdate
                }
                sqlist = {
                    sqlist
                }
                delays = {
                    delays
                }
                /> <
                /Box>
            ))
        } <
        /Box> <
        /Container>
    );
}

export default DynamicTablesRenderer;