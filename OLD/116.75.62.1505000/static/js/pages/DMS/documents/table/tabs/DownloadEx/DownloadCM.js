import XLSX from "xlsx-js-style";
import {
    saveAs
} from "file-saver";

export const exportCommentsToExcel = (
    comments,
    fileName = "Review_Comments"
) => {
    if (!comments ? .length) {
        alert("No data available to export");
        return;
    }

    const groupedComments = comments.reduce((acc, item) => {
        const revision =
            item.document_version_number ||
            (item.revision_no ? `R${item.revision_no}` : "Unknown");

        if (!acc[revision]) {
            acc[revision] = [];
        }

        acc[revision].push(item);

        return acc;
    }, {});


    const excelData = [];

    Object.entries(groupedComments).forEach(([revision, revisionComments]) => {
        // Divider row
        excelData.push({
            "Sr No": `Revision ${revision} — ${revisionComments.length} Comment${revisionComments.length !== 1 ? "s" : ""}`,
        });

        // Actual comments
        revisionComments.forEach((item, index) => {
            excelData.push({
                "Sr No": index + 1,
                "Comment No": item.comment_no,
                Section: item.section,
                "Page No": item.page_no,
                Severity: item.severity ? .toUpperCase(),
                "Comment Type": item.comment_type,
                "Reviewer Comment": item.reviewer_comment,
                "Proposed Solution": item.proposed_solution,
                Status: item.status,
                "Action Status": item.action_status,
                "Created By": item.created_by_name,
                "Created At": item.created_at ?
                    new Date(item.created_at).toLocaleString() :
                    "-",
                "PM Response": item.pm_response || "-",
                "Vendor Response": item.vendor_response || "-",
                Resolved: item.resolved ? "Yes" : "No",
                Version: item.version,
                "Revision No": item.revision_no,
            });
        });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Column Widths
    worksheet["!cols"] = [{
            wch: 8
        },
        {
            wch: 12
        },
        {
            wch: 20
        },
        {
            wch: 10
        },
        {
            wch: 12
        },
        {
            wch: 15
        },
        {
            wch: 50
        },
        {
            wch: 50
        },
        {
            wch: 12
        },
        {
            wch: 15
        },
        {
            wch: 20
        },
        {
            wch: 22
        },
        {
            wch: 30
        },
        {
            wch: 30
        },
        {
            wch: 10
        },
        {
            wch: 10
        },
        {
            wch: 10
        },
    ];

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    const dividerRows = [];

    // Header Styling
    for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({
            r: 0,
            c: col
        });

        worksheet[headerCell].s = {
            font: {
                bold: true,
                color: {
                    rgb: "FFFFFF"
                },
                sz: 12,
            },
            fill: {
                fgColor: {
                    rgb: "1F4E78"
                }, // Dark Blue
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

    // Data Row Styling
    for (let row = 1; row <= range.e.r; row++) {

        const firstCell = XLSX.utils.encode_cell({
            r: row,
            c: 0
        });

        const isDivider =
            worksheet[firstCell] ? .v &&
            worksheet[firstCell].v.toString().startsWith("Revision");

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
                };
            }

            continue;
        }

        const severityCell = XLSX.utils.encode_cell({
            r: row,
            c: 4
        });

        const severity =
            worksheet[severityCell] ? .v ? .toString() ? .toLowerCase() || "";

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

    worksheet["!merges"] = dividerRows.map((row) => ({
        s: {
            r: row,
            c: 0
        },
        e: {
            r: row,
            c: 16
        }, // last column index
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comments");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    saveAs(
        new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${fileName}.xlsx`
    );
};