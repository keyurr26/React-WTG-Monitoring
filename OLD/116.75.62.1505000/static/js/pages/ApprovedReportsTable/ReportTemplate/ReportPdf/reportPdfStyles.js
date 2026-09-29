// ReportPdf/reportPdfStyles.js
import {
    StyleSheet
} from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 0,
        fontFamily: "Helvetica",
        position: "relative",
    },
    pageContent: {
        flex: 1,
        padding: 20,
        paddingBottom: 50,
    },
    headerContainer: {
        flexDirection: "row",
        border: "1px solid #777",
        backgroundColor: "#f0f8ff",
        alignItems: "center",
        marginBottom: 15,
        minHeight: 50,
    },
    logoBox: {
        width: 100,
        padding: 6,
        borderRight: "1px solid #777",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 70,
        height: 35,
        objectFit: "contain",
    },
    titleBox: {
        flex: 1,
        textAlign: "center",
        padding: 8,
    },
    titleText: {
        fontSize: 14,
        color: "#003366",
        textTransform: "uppercase",
        fontWeight: "bold",
        marginBottom: 2,
    },
    subtitleText: {
        fontSize: 7,
        color: "#444",
    },
    sectionTitle: {
        fontSize: 10,
        color: "#003366",
        fontWeight: "bold",
        marginBottom: 6,
        marginTop: 8,
        borderBottomWidth: 0.4,
        borderBottomColor: "#003366",
        borderBottomStyle: "solid",
        paddingBottom: 3,
    },
    sectionNote: {
        fontSize: 8,
        fontStyle: "italic",
        color: "#555",
        marginBottom: 8,
    },
    table: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#777",
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#777",
        borderBottomStyle: "solid",
        minHeight: 22,
        alignItems: "stretch",
    },
    tableCellText: {
        fontSize: 7,
        color: "#333",
    },
    statusBadge: {
        padding: "1px 4px",
        borderRadius: 2,
        fontSize: 5,
        fontWeight: "bold",
        textAlign: "center",
    },
    statusCompleted: {
        // backgroundColor: "#d4edda",
        color: "#060a07",
    },
    statusInProgress: {
        backgroundColor: "#fff3cd",
        color: "#856404",
    },
    statusPending: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    dividerLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#006400",
        borderBottomStyle: "solid",
        marginBottom: 3,
    },
    footerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 6,
        color: "#333",
    },
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginVertical: 15,
        gap: -2,
    },
    gridImage: {
        width: "30%",
        height: 120,
        objectFit: "cover",
        margin: 0,
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "solid",
        borderRadius: 1,
    },
    reLogo: {
        width: 120,
        height: 80,
        objectFit: "contain",
        alignSelf: "center",
        marginVertical: 6,
    },
    detailsTable: {
        marginTop: 8,
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    detailLabel: {
        width: 80,
        fontWeight: "600",
        fontSize: 10,
    },
    detailValue: {
        flex: 1,
        fontSize: 10,
    },
    // ReportPdf/reportPdfStyles.js

    // ... keep all your existing styles ...

    // ---- Image container: wraps the Image in a table cell ----
    evidencePhotoCell: {
        width: "100%",
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
    },

    // ---- Actual image: fills its parent cell, keeps aspect ratio ----
    evidencePhoto: {
        width: "100%",
        // react-pdf does NOT support height:"auto" reliably,
        // so we set a maxHeight instead and let objectFit handle it.
        height: 55, // default cap
        objectFit: "contain", // prevents cropping when cell is narrow
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "solid",
    },

    evidencePhotoSmall: {
        width: "100%",
        height: 38,
        objectFit: "contain",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "solid",
    },

    evidencePhotoNormal: {
        width: "100%",
        height: 55,
        objectFit: "contain",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "solid",
    },

    evidencePhotoLarge: {
        width: "100%",
        height: 80,
        objectFit: "contain",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "solid",
    },


    noPhotoText: {
        color: "#999",
        fontSize: 5,
        fontStyle: "italic",
    },
    pageNumber: {
        fontSize: 6,
    },
});

// Helper function for photo style
export const getPhotoStyle = (size = "normal") => {
    const heights = {
        small: 60,
        normal: 110,
        large: 120,
    };
    return {
        width: "100%", // ← parent View ke andar 100%
        height: heights[size] || heights.normal,
        objectFit: "contain",
        borderRadius: 2,
        // borderWidth: 1,
        // borderColor: "#ddd",
        borderStyle: "solid",
    };
};