import XLSX from "xlsx-js-style";
import {
    saveAs
} from "file-saver";

export const exportAllDocumentsCommentsToExcel = (
    documents,
    projectName,
    windfarmName
) => {
    if (!documents ? .length) {
        alert("No data available to export");
        return;
    }

    const excelData = [];

    // =====================================================
    // PROJECT HEADING
    // =====================================================
    excelData.push({
        "Project Name": projectName || "-",
        "Windfarm Name": "",
        "Document Name": "",
        "Sr No": "",
        "Comment No": "",
        "Section": "",
        "Page No": "",
        "Severity": "",
        "Comment Type": "",
        "Reviewer Comment": "",
        "Proposed Solution": "",
        "PM Response": "",
        "Vendor Response": "",
        "Status": "",
        "Action Status": "",
        "Created By": "",
        "Created At": "",
        "Resolved": "",
        "Closed By": "",
        "Revision No": "",
        // "Version": "",
    });

    // =====================================================
    // WINDFARM HEADING
    // =====================================================
    excelData.push({
        "Project Name": "",
        "Windfarm Name": windfarmName || "-",
        "Document Name": "",
        "Sr No": "",
        "Comment No": "",
        "Section": "",
        "Page No": "",
        "Severity": "",
        "Comment Type": "",
        "Reviewer Comment": "",
        "Proposed Solution": "",
        "PM Response": "",
        "Vendor Response": "",
        "Status": "",
        "Action Status": "",
        "Created By": "",
        "Created At": "",
        "Resolved": "",
        "Closed By": "",
        "Revision No": "",
        // "Version": "",
    });

    // Empty row
    excelData.push({
        "Project Name": "",
        "Windfarm Name": "",
        "Document Name": "",
        "Sr No": "",
        "Comment No": "",
        "Section": "",
        "Page No": "",
        "Severity": "",
        "Comment Type": "",
        "Reviewer Comment": "",
        "Proposed Solution": "",
        "PM Response": "",
        "Vendor Response": "",
        "Status": "",
        "Action Status": "",
        "Created By": "",
        "Created At": "",
        "Resolved": "",
        "Closed By": "",
        "Revision No": "",
        // "Version": "",
    });

    // =====================================================
    // DOCUMENTS
    // =====================================================
    documents.forEach((document) => {
        // ---------------------------------------------------
        // DOCUMENT HEADING
        // ---------------------------------------------------
        excelData.push({
            "Project Name": "",
            "Windfarm Name": "",
            "Document Name": document.title || "-",
            "Sr No": "",
            "Comment No": "",
            "Section": "",
            "Page No": "",
            "Severity": "",
            "Comment Type": "",
            "Reviewer Comment": "",
            "Proposed Solution": "",
            "PM Response": "",
            "Vendor Response": "",
            "Status": "",
            "Action Status": "",
            "Created By": "",
            "Created At": "",
            "Resolved": "",
            "Closed By": "",
            "Revision No": "",
            //   "Version": "",
        });

        // ---------------------------------------------------
        // COMMENTS
        // ---------------------------------------------------
        const comments = Array.isArray(document.comments) ? document.comments : [];

        if (!comments.length) {
            excelData.push({
                "Project Name": "",
                "Windfarm Name": "",
                "Document Name": "",
                "Sr No": "",
                "Comment No": "",
                "Section": "",
                "Page No": "",
                "Severity": "",
                "Comment Type": "",
                "Reviewer Comment": "No comments found",
                "Proposed Solution": "",
                "PM Response": "",
                "Vendor Response": "",
                "Status": "",
                "Action Status": "",
                "Created By": "",
                "Created At": "",
                "Resolved": "",
                "Closed By": "",
                "Revision No": "-",
                // "Version": "",
            });

            excelData.push({
                "Project Name": "",
                "Windfarm Name": "",
                "Document Name": "",
                "Sr No": "",
                "Comment No": "",
                "Section": "",
                "Page No": "",
                "Severity": "",
                "Comment Type": "",
                "Reviewer Comment": "",
                "Proposed Solution": "",
                "PM Response": "",
                "Vendor Response": "",
                "Status": "",
                "Action Status": "",
                "Created By": "",
                "Created At": "",
                "Resolved": "",
                "Closed By": "",
                "Revision No": "",
                // "Version": "",
            });
            return;
        }

        // ---------------------------------------------------
        // GROUP COMMENTS BY REVISION
        // ---------------------------------------------------
        const revisionMap = {};

        comments.forEach((comment) => {
            const revision =
                comment.revision_no ||
                comment.version ? .version ||
                comment.version ? .document_version_number ||
                comment.document_version_number ||
                "-";

            if (!revisionMap[revision]) {
                revisionMap[revision] = [];
            }

            revisionMap[revision].push(comment);
        });

        // ---------------------------------------------------
        // WRITE REVISION + COMMENTS
        // ---------------------------------------------------
        Object.entries(revisionMap).forEach(([revision, revisionComments]) => {
            // Revision header row
            excelData.push({
                "Project Name": "",
                "Windfarm Name": "",
                "Document Name": "",
                "Sr No": `Revision ${revision} — ${revisionComments.length} Comment${revisionComments.length !== 1 ? "s" : ""}`,
                "Comment No": "",
                "Section": "",
                "Page No": "",
                "Severity": "",
                "Comment Type": "",
                "Reviewer Comment": "",
                "Proposed Solution": "",
                "PM Response": "",
                "Vendor Response": "",
                "Status": "",
                "Action Status": "",
                "Created By": "",
                "Created At": "",
                "Resolved": "",
                "Closed By": "",
                "Revision No": "",
                // "Version": "",
            });

            // Sort comments by comment_no to maintain order
            const sortedComments = [...revisionComments].sort(
                (a, b) => (a.comment_no || 0) - (b.comment_no || 0)
            );

            sortedComments.forEach((comment, index) => {
                // Get version info
                // const version = comment.version?.version || comment.version || "-";
                const revisionNo = comment.revision_no || revision || "-";

                excelData.push({
                    "Project Name": "",
                    "Windfarm Name": "",
                    "Document Name": "",
                    "Sr No": index + 1,
                    "Comment No": comment.comment_no || "-",
                    "Section": comment.section || "-",
                    "Page No": comment.page_no || "-",
                    "Severity": comment.severity ? .toUpperCase() || "-",
                    "Comment Type": comment.comment_type || "-",
                    "Reviewer Comment": comment.reviewer_comment || "-",
                    "Proposed Solution": comment.proposed_solution || "-",
                    "PM Response": comment.pm_response || "-",
                    "Vendor Response": comment.vendor_response || "-",
                    "Status": comment.status || "-",
                    "Action Status": comment.action_status || "-",
                    "Created By": comment.created_by ? .full_name ||
                        comment.created_by_name ||
                        comment.created_by ? .email ||
                        "-",
                    "Created At": comment.created_at ?
                        new Date(comment.created_at).toLocaleString() :
                        "-",
                    "Resolved": comment.resolved ? "Yes" : "No",
                    "Closed By": comment.closed_by ? .full_name ||
                        comment.closed_by_name ||
                        comment.closed_by ? .email ||
                        "-",
                    "Revision No": revisionNo,
                    //   "Version": version,
                });
            });

            // Empty row after revision
            excelData.push({
                "Project Name": "",
                "Windfarm Name": "",
                "Document Name": "",
                "Sr No": "",
                "Comment No": "",
                "Section": "",
                "Page No": "",
                "Severity": "",
                "Comment Type": "",
                "Reviewer Comment": "",
                "Proposed Solution": "",
                "PM Response": "",
                "Vendor Response": "",
                "Status": "",
                "Action Status": "",
                "Created By": "",
                "Created At": "",
                "Resolved": "",
                "Closed By": "",
                "Revision No": "",
                // "Version": "",
            });
        });

        // Empty row after document
        excelData.push({
            "Project Name": "",
            "Windfarm Name": "",
            "Document Name": "",
            "Sr No": "",
            "Comment No": "",
            "Section": "",
            "Page No": "",
            "Severity": "",
            "Comment Type": "",
            "Reviewer Comment": "",
            "Proposed Solution": "",
            "PM Response": "",
            "Vendor Response": "",
            "Status": "",
            "Action Status": "",
            "Created By": "",
            "Created At": "",
            "Resolved": "",
            "Closed By": "",
            "Revision No": "",
            //   "Version": "",
        });
    });

    // =====================================================
    // CREATE WORKSHEET
    // =====================================================
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // =====================================================
    // COLUMN WIDTH
    // =====================================================
    worksheet["!cols"] = [{
            wch: 25
        }, // Project Name
        {
            wch: 25
        }, // Windfarm Name
        {
            wch: 35
        }, // Document Name
        {
            wch: 8
        }, // Sr No
        {
            wch: 12
        }, // Comment No
        {
            wch: 20
        }, // Section
        {
            wch: 10
        }, // Page No
        {
            wch: 12
        }, // Severity
        {
            wch: 15
        }, // Comment Type
        {
            wch: 50
        }, // Reviewer Comment
        {
            wch: 50
        }, // Proposed Solution
        {
            wch: 30
        }, // PM Response
        {
            wch: 30
        }, // Vendor Response
        {
            wch: 12
        }, // Status
        {
            wch: 15
        }, // Action Status
        {
            wch: 20
        }, // Created By
        {
            wch: 22
        }, // Created At
        {
            wch: 10
        }, // Resolved
        {
            wch: 20
        }, // Closed By
        {
            wch: 10
        }, // Revision No
        // { wch: 10 },  // Version
    ];

    // =====================================================
    // STYLING
    // =====================================================
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const dividerRows = [];

    // Header Styling (Row 0 - Project Name, Row 1 - Windfarm Name)
    for (let row = 0; row <= 1; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({
                r: row,
                c: col
            });

            if (!worksheet[cellAddress]) {
                worksheet[cellAddress] = {
                    t: "s",
                    v: ""
                };
            }

            const cellValue = worksheet[cellAddress].v;
            const isHeaderValue = cellValue && (row === 0 || row === 1);

            worksheet[cellAddress].s = {
                font: {
                    bold: true,
                    color: {
                        rgb: "FFFFFF"
                    },
                    sz: isHeaderValue ? 12 : 12,
                },
                fill: {
                    fgColor: {
                        rgb: isHeaderValue ? "1F4E78" : "D3D3D3"
                    },
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true,
                },
                border: {
                    top: {
                        style: "thin",
                        color: {
                            rgb: "000000"
                        }
                    },
                    bottom: {
                        style: "thin",
                        color: {
                            rgb: "000000"
                        }
                    },
                    left: {
                        style: "thin",
                        color: {
                            rgb: "000000"
                        }
                    },
                    right: {
                        style: "thin",
                        color: {
                            rgb: "000000"
                        }
                    },
                },
            };
        }
    }

    // Process data rows (starting from row 2)
    for (let row = 2; row <= range.e.r; row++) {
        const firstCell = XLSX.utils.encode_cell({
            r: row,
            c: 3
        });
        const cellValue = worksheet[firstCell] ? .v ? .toString() || "";

        const isDivider = cellValue.startsWith("Revision");
        const isDocumentHeader =
            worksheet[XLSX.utils.encode_cell({
                r: row,
                c: 2
            })] ? .v && // Document Name column
            !worksheet[XLSX.utils.encode_cell({
                r: row,
                c: 3
            })] ? .v; // Sr No column

        if (isDivider) {
            dividerRows.push(row);

            for (let col = range.s.c; col <= range.e.c; col++) {
                const cell = XLSX.utils.encode_cell({
                    r: row,
                    c: col
                });

                if (!worksheet[cell]) {
                    worksheet[cell] = {
                        t: "s",
                        v: ""
                    };
                }

                worksheet[cell].s = {
                    fill: {
                        fgColor: {
                            rgb: "EDE9FE"
                        },
                    },
                    font: {
                        bold: true,
                        color: {
                            rgb: "6D28D9"
                        },
                        sz: 12,
                    },
                    alignment: {
                        horizontal: "left",
                        vertical: "center",
                    },
                    border: {
                        top: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                        bottom: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                        left: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                        right: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                    },
                };
            }
            continue;
        }

        if (isDocumentHeader) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cell = XLSX.utils.encode_cell({
                    r: row,
                    c: col
                });

                if (!worksheet[cell]) {
                    worksheet[cell] = {
                        t: "s",
                        v: ""
                    };
                }

                worksheet[cell].s = {
                    fill: {
                        fgColor: {
                            rgb: "E3F2FD"
                        },
                    },
                    font: {
                        bold: true,
                        color: {
                            rgb: "0D47A1"
                        },
                        sz: 11,
                    },
                    alignment: {
                        horizontal: "left",
                        vertical: "center",
                    },
                    border: {
                        top: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                        bottom: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                        left: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                        right: {
                            style: "thin",
                            color: {
                                rgb: "D9D9D9"
                            }
                        },
                    },
                };
            }
            continue;
        }

        // Regular data rows - Check severity for color coding
        const severityCell = XLSX.utils.encode_cell({
            r: row,
            c: 7
        });
        const severity = worksheet[severityCell] ? .v ? .toString() ? .toLowerCase() || "";

        let rowColor = "FFFFFF";
        if (severity === "critical") {
            rowColor = "F8D7DA"; // Light Red
        } else if (severity === "major") {
            rowColor = "FFF3CD"; // Light Yellow
        } else if (severity === "minor") {
            rowColor = "D4EDDA"; // Light Green
        }

        for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = XLSX.utils.encode_cell({
                r: row,
                c: col
            });

            if (!worksheet[cell]) continue;

            worksheet[cell].s = {
                fill: {
                    fgColor: {
                        rgb: row % 2 === 0 ? rowColor : "FFFFFF"
                    },
                },
                alignment: {
                    vertical: "top",
                    wrapText: true,
                },
                border: {
                    top: {
                        style: "thin",
                        color: {
                            rgb: "D9D9D9"
                        }
                    },
                    bottom: {
                        style: "thin",
                        color: {
                            rgb: "D9D9D9"
                        }
                    },
                    left: {
                        style: "thin",
                        color: {
                            rgb: "D9D9D9"
                        }
                    },
                    right: {
                        style: "thin",
                        color: {
                            rgb: "D9D9D9"
                        }
                    },
                },
            };
        }
    }

    // Merge cells for revision divider rows
    worksheet["!merges"] = dividerRows.map((row) => ({
        s: {
            r: row,
            c: 3
        },
        e: {
            r: row,
            c: 19
        },
    }));

    // =====================================================
    // CREATE WORKBOOK
    // =====================================================
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Document Comments");

    // =====================================================
    // FILE NAME
    // =====================================================
    const safeProjectName = String(projectName || "Project").replace(
        /[\\/:*?"<>|]/g,
        "_"
    );
    const safeWindfarmName = String(windfarmName || "Windfarm").replace(
        /[\\/:*?"<>|]/g,
        "_"
    );

    const fileName = `${safeProjectName}_${safeWindfarmName}_Document_Comments.xlsx`;

    // =====================================================
    // SAVE FILE
    // =====================================================
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    saveAs(
        new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
    );
};