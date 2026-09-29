import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 25,
        fontSize: 9,
        fontFamily: "Helvetica",
    },

    header: {
        marginBottom: 15,
        borderBottom: "1 solid #ccc",
        paddingBottom: 10,
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },

    subtitle: {
        fontSize: 10,
        color: "#555",
    },

    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },

    summaryBox: {
        padding: 8,
        backgroundColor: "#f1f5f9",
        borderRadius: 3,
    },

    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#d1d5db",
    },

    headerRow: {
        backgroundColor: "#1e293b",
        color: "#fff",
    },

    cell: {
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: "#d1d5db",
    },

    date: {
        width: "11%",
    },

    turbine: {
        width: "11%",
    },

    activity: {
        width: "22%",
    },

    quantity: {
        width: "13%",
    },

    status: {
        width: "13%",
    },

    approval: {
        width: "13%",
    },

    photo: {
        width: "15%",
        borderRightWidth: 0,
    },

    photoImage: {
        width: 120,
        height: 90,
        objectFit: "cover",
    },

    headerText: {
        color: "#fff",
        fontWeight: "bold",
    },

    photoText: {
        color: "#2563eb",
        fontSize: 8,
    },

    footer: {
        position: "absolute",
        bottom: 15,
        left: 25,
        right: 25,
        textAlign: "center",
        fontSize: 8,
        color: "#777",
    },
});

const FoundationDPRMonthlyPDF = ({
    data = [],
    month,
    filters = {},
    totalCount = 0,
}) => {
    return ( <
        Document >
        <
        Page size = "A4"
        orientation = "landscape"
        style = {
            styles.page
        } > { /* Header */ } <
        View style = {
            styles.header
        } >
        <
        Text style = {
            styles.title
        } > Foundation Daily Progress Report < /Text>

        <
        Text style = {
            styles.subtitle
        } > Monthly Report - {
            month
        } < /Text> <
        /View>

        { /* Filters / Summary */ } <
        View style = {
            styles.summary
        } >
        <
        View style = {
            styles.summaryBox
        } >
        <
        Text > Project: {
            filters.project_name || "All"
        } < /Text> <
        /View>

        <
        View style = {
            styles.summaryBox
        } >
        <
        Text > Windfarm: {
            filters.windfarm_name || "All"
        } < /Text> <
        /View>

        <
        View style = {
            styles.summaryBox
        } >
        <
        Text > Cluster: {
            filters.cluster_name || "All"
        } < /Text> <
        /View>

        <
        View style = {
            styles.summaryBox
        } >
        <
        Text > Total Activities: {
            totalCount
        } < /Text> <
        /View> <
        /View>

        { /* Table */ } <
        View style = {
            styles.table
        } > { /* Header */ } <
        View style = {
            [styles.tableRow, styles.headerRow]
        } >
        <
        View style = {
            [styles.cell, styles.date]
        } >
        <
        Text style = {
            styles.headerText
        } > Date < /Text> <
        /View>

        <
        View style = {
            [styles.cell, styles.turbine]
        } >
        <
        Text style = {
            styles.headerText
        } > Turbine No < /Text> <
        /View>

        <
        View style = {
            [styles.cell, styles.activity]
        } >
        <
        Text style = {
            styles.headerText
        } > Activity < /Text> <
        /View>

        <
        View style = {
            [styles.cell, styles.quantity]
        } >
        <
        Text style = {
            styles.headerText
        } > Quantity < /Text> <
        /View>

        <
        View style = {
            [styles.cell, styles.status]
        } >
        <
        Text style = {
            styles.headerText
        } > Status < /Text> <
        /View>

        <
        View style = {
            [styles.cell, styles.approval]
        } >
        <
        Text style = {
            styles.headerText
        } > Approval < /Text> <
        /View>

        <
        View style = {
            [styles.cell, styles.photo]
        } >
        <
        Text style = {
            styles.headerText
        } > Photo < /Text> <
        /View> <
        /View>

        { /* Rows */ } {
            data.map((row, index) => ( <
                View style = {
                    styles.tableRow
                }
                key = {
                    index
                } >
                <
                View style = {
                    [styles.cell, styles.date]
                } >
                <
                Text > {
                    row.date || "-"
                } < /Text> <
                /View>

                <
                View style = {
                    [styles.cell, styles.turbine]
                } >
                <
                Text > {
                    row.turbine_no || "-"
                } < /Text> <
                /View>

                <
                View style = {
                    [styles.cell, styles.activity]
                } >
                <
                Text > {
                    row.activity || "-"
                } < /Text> <
                /View>

                <
                View style = {
                    [styles.cell, styles.quantity]
                } >
                <
                Text > {
                    row.quantity || "-"
                } < /Text> <
                /View>

                <
                View style = {
                    [styles.cell, styles.status]
                } >
                <
                Text > {
                    row.status || "-"
                } < /Text> <
                /View>

                <
                View style = {
                    [styles.cell, styles.approval]
                } >
                <
                Text > {
                    row.is_approved ? "Approved" : "Pending"
                } < /Text> <
                /View>

                <
                View style = {
                    [styles.cell, styles.photo]
                } > {
                    row.photo ? (
                        //   <Image src={row.photo} style={styles.photoImage} />
                        <
                        Image src = {
                            row.photo
                        }
                        style = {
                            {
                                width: 80,
                                maxHeight: 60,
                                objectFit: "contain",
                            }
                        }
                        />
                    ) : ( <
                        Text > - < /Text>
                    )
                } <
                /View> <
                /View>
            ))
        } <
        /View>

        <
        Text style = {
            styles.footer
        } >
        Generated on {
            new Date().toLocaleDateString()
        } <
        /Text> <
        /Page> <
        /Document>
    );
};

export default FoundationDPRMonthlyPDF;