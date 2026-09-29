export const ROLE_MENU_ACCESS = {
    admin: [
        "dashboard",
        "masters",
        "approvedReports",
        "inventoryDashboard",
        "map",
        "elemap",
        "sqAdmin",
        "dms"
    ],

    inspector: [
        "construction",
        "inventoryManagement",
        "sqInspector",
        "dms"
        // "dailyActivity",

    ],

    quality_officer: [
        "safetyQuality",
        //  "sqAdmin",
        // "sq_form",
        // "sq_list"
    ],

    safety_officer: [
        "safetyQuality",
        //  "sqAdmin",
        // "sq_form",
        // "sq_list"
    ],

    supervisor: [
        "construction",
        "inventoryManagement",
        // "sqAdmin"
        // "dailyActivity",

    ],

    store_keeper: [
        "inventoryManagement",
        // "inventoryDashboard"
    ],

    customer: [
        "dms",
        // "inventoryDashboard"
    ]

    // user: [
    //     "inventoryDashboard"
    // ]
};