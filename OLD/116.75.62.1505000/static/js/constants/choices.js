export const ACCESS_LEVEL_CHOICES = [{
        value: "project",
        label: "Project Level"
    },
    {
        value: "windfarm",
        label: "Windfarm Level"
    },
];

// constants/weatherOptions.js
export const ZONE_OPTIONS = [{
        label: "North",
        value: "N"
    },
    {
        label: "South",
        value: "S"
    },
    {
        label: "East",
        value: "E"
    },
    {
        label: "West",
        value: "W"
    },
    {
        label: "Coastal",
        value: "C"
    },
    {
        label: "Turbine Bay",
        value: "TB"
    },
    {
        label: "Other",
        value: "O"
    },

];

export const WEATHER_OPTIONS = [{
        value: "sunny",
        label: "Sunny"
    },
    {
        value: "cloudy",
        label: "Cloudy"
    },
    {
        value: "rainy",
        label: "Rainy"
    },
    {
        value: "windy",
        label: "Windy"
    },
    {
        value: "hot",
        label: "Hot"
    },
];

// src/constants/pipeMaterials.js  for conduit laying
export const PIPE_MATERIAL_OPTIONS = [{
        value: "PVC",
        label: "PVC"
    },
    {
        value: "HDPE",
        label: "HDPE"
    },
    {
        value: "Copper",
        label: "Copper"
    },
    {
        value: "GI",
        label: "Galvanized Iron"
    },
    {
        value: "Steel",
        label: "Steel"
    },
    {
        value: "Other",
        label: "Other"
    },
];

//   pouring
export const ACCEPT_REJECT_CHOICES = [{
        value: "accept",
        label: "Accept"
    },
    {
        value: "reject",
        label: "Reject"
    }

]
// cube sampling
export const CURING_METHOD_OPTIONS = [{
        value: "Water Tank",
        label: "Water Tank (Standard)"
    },
    {
        value: "Steam Curing",
        label: "Steam Curing"
    },
    {
        value: "Curing Compound",
        label: "Curing Compound"
    },
    {
        value: "Accelerated",
        label: "Accelerated Curing"
    },
];

export const CUBE_TEST_RESULT_DAYS = [{
        value: "7 Days",
        label: "7 Days"
    },
    {
        value: "14 Days",
        label: "14 Days"
    },
    {
        value: "21 Days",
        label: "21 Days"
    },
    {
        value: "28 Days",
        label: "28 Days"
    },
];

export const PASS_FAIL_OPTIONS = [{
        value: "Pass",
        label: "Pass"
    },
    {
        value: "Fail",
        label: "Fail"
    },

];


export const PROGRESS_LEVELS = [{
        value: "LEVEL 0",
        label: "Level 0"
    },
    {
        value: "LEVEL 1",
        label: "Level 1"
    },
    {
        value: "LEVEL 2",
        label: "Level 2"
    },
    {
        value: "LEVEL 3",
        label: "Level 3"
    },
    {
        value: "LEVEL F",
        label: "Level F"
    },

];

export const BLADE_NO_CHOICES = [{
        value: "Blade-A",
        label: "Blade-A"
    },
    {
        value: "Blade-B",
        label: "Blade-B"
    },
    {
        value: "Blade-C",
        label: "Blade-C"
    },
]

export const ACTIVITY_CHOICES = [{
        value: "SOIL",
        label: "Soil Report"
    },
    {
        value: "EXC",
        label: "Excavation"
    },
    {
        value: "PCC",
        label: "PCC Layer"
    },
    {
        value: "CONDUIT",
        label: "Conduit Laying"
    },
    {
        value: "ANCHOR",
        label: "Anchor Cage"
    },
    {
        value: "REINF",
        label: "Reinforcement"
    },
    {
        value: "CAST",
        label: "Foundation Casting"
    },
    {
        value: "POUR",
        label: "Pouring"
    },
    {
        value: "DESHUTTER",
        label: "Deshuttering"
    },
    // { value: "CUBE", label: "Cube Sample" },
    {
        value: "WATER",
        label: "Watering Schedule"
    },
    {
        value: "CUBE_RESULT",
        label: "Cube Test Result"
    },
    {
        value: "BACKFILL",
        label: "Backfilling"
    },
    {
        value: "PLATFORM",
        label: "Plateform"
    },
    // Installation activities
    {
        value: "T1_INSTALL",
        label: "T1 Installation"
    },
    {
        value: "TOWER_INSTALL",
        label: "Tower Installation"
    },
    {
        value: "NACELLE",
        label: "Nacelle Installation"
    },
    {
        value: "ROTOR_HUB",
        label: "Rotor Hub Installation"
    },
    {
        value: "BLADES",
        label: "Blade Installation"
    },

    // Electrical & commissioning
    {
        value: "SCOH Dog",
        label: "SCOH Dog"
    },
    {
        value: "SCOH",
        label: "SCOH"
    },
    {
        value: "DCOH",
        label: "DCOH"
    },
    {
        value: "MCOH",
        label: "MCOH"
    }
    // { value: "FEEDER", label: "Feeder Details" },
    // { value: "COMMISSION", label: "Commissioning Details" },
];


//safety and Quality
export const SQ_STATUS_OPTIONS = [{
        value: "open",
        label: "Open"
    },
    {
        value: "resolved",
        label: "Resolved"
    },
    {
        value: "closed",
        label: "Closed"
    },
    {
        value: "rejected",
        label: "Rejected"
    },
];


export const SQ_SEVERITY_OPTIONS = [{
        value: "low",
        label: "Low"
    },
    {
        value: "medium",
        label: "Medium"
    },
    {
        value: "high",
        label: "High"
    },
    {
        value: "critical",
        label: "Critical"
    },
];

export const SQ_CATEGORY_CHOICES = [{
        value: "foundation",
        label: "Foundation"
    },
    {
        value: "wtg_installation",
        label: "WTG Installation"
    },
    {
        value: "electrical",
        label: "Electrical"
    },
    {
        value: "road",
        label: "Road"
    },
    {
        value: "uss",
        label: "USS"
    },
];

export const CATEGORY_ACTIVITY_MAP = {
    foundation: [{
            value: "SOIL",
            label: "Soil Report"
        },
        {
            value: "EXC",
            label: "Excavation"
        },
        {
            value: "PCC",
            label: "PCC Layer"
        },
        {
            value: "CONDUIT",
            label: "Conduit Laying"
        },
        {
            value: "ANCHOR",
            label: "Anchor Cage"
        },
        {
            value: "REINF",
            label: "Reinforcement"
        },
        {
            value: "CAST",
            label: "Foundation Casting"
        },
        {
            value: "POUR",
            label: "Pouring"
        },
        {
            value: "DESHUTTER",
            label: "Deshuttering"
        },
        {
            value: "WATER",
            label: "Watering Schedule"
        },
        {
            value: "CUBE_RESULT",
            label: "Cube Test Result"
        },
        {
            value: "BACKFILL",
            label: "Backfilling"
        },
    ],
    installation: [{
            value: "T1_INSTALL",
            label: "T1 Installation"
        },
        {
            value: "TOWER_INSTALL",
            label: "Tower Installation"
        },
        {
            value: "NACELLE",
            label: "Nacelle Installation"
        },
        {
            value: "ROTOR_HUB",
            label: "Rotor Hub Installation"
        },
        {
            value: "BLADES",
            label: "Blade Installation"
        },
    ],
    electrical: [{
            value: "SCOH Dog",
            label: "SCOH Dog"
        },
        {
            value: "SCOH",
            label: "SCOH"
        },
        {
            value: "DCOH",
            label: "DCOH"
        },
        {
            value: "MCOH",
            label: "MCOH"
        },
        // { value: "FEEDER", label: "Feeder Details" },
        // { value: "COMMISSION", label: "Commissioning Details" },
    ],
    road: [{
            value: "MAIN ROAD",
            label: "Main Road"
        },
        {
            value: "APPROACH ROAD",
            label: "Approach Road"
        },
        {
            value: "ACCESS ROAD",
            label: "Access Road"
        },
    ],
    uss: [{
            value: "DP_YARD_COLUMN_CASTING",
            label: "DP Yard Column Casting"
        },
        {
            value: "DP_YARD_SLAB_ERECTION",
            label: "DP Yard Slab Erection"
        },
        {
            value: "DELIVERY_OF_ELECTRICAL_ACCESSORIES",
            label: "Delivery of Electrical Accessories"
        },
        {
            value: "TRAFO_CSS_ERECTION",
            label: "Trafo/CSS Erection"
        },
        {
            value: "INSTALLATION_OF_ELECTRICAL_ACCESSORIES",
            label: "Installation of Electrical Accessories"
        },
        {
            value: "EARTH_PIT_MARKING",
            label: "Earth Pit Marking"
        },
        {
            value: "EARTH_BORING",
            label: "Earth Boring"
        },
        {
            value: "EARTH_ROD_INSTALLATION",
            label: "Earth Rod Installation"
        },
        {
            value: "EARTHING_STRIP_LAYING",
            label: "Earthing Strip Laying"
        },
        {
            value: "LT_CABLE_TERMINATION",
            label: "LT Cable Termination"
        },
        {
            value: "HAND_RAIL_FIXING_ON_TRANSFORMER_SLAB",
            label: "Hand Rail Fixing on Transformer Slab"
        },
        {
            value: "DP_YARD_COMPLETION",
            label: "DP Yard Completion"
        },
        {
            value: "SERVICE_LIFT_PLATFORM",
            label: "Service Lift Platform"
        },
        {
            value: "EB_COMMISSIONING",
            label: "EB Commissioning"
        },
    ],
};

export const TOWER_OPTIONS = [{
        value: "T2",
        label: "T2"
    },
    {
        value: "T3",
        label: "T3"
    },
    {
        value: "T4",
        label: "T4"
    },
    {
        value: "T5",
        label: "T5"
    },
];

export const FOUNDATION_ACTIVITY_MAP = [{
        label: "Soil",
        key: "soil_test"
    },
    {
        label: "Excavation",
        key: "excavation_test"
    },
    {
        label: "PCC Layer",
        key: "pcclayer_test"
    },
    {
        label: "Conduit",
        key: "conductlaying_test"
    },
    {
        label: "Anchor Cage",
        key: "anchor_cage_test"
    },
    {
        label: "Reinforcement",
        key: "reinforcement_test"
    },
    {
        label: "Casting",
        key: "foundation_test"
    },
    {
        label: "Pouring",
        key: "pouring_test"
    },
    // { label: "Cube Sample", key: "cube_sample" },
    // { label: "Watering", key: "watering_schedule" },
    {
        label: "Deshuttering",
        key: "deshutter"
    },
    {
        label: "Cube Result",
        key: "cube_result"
    },

    {
        label: "Backfilling",
        key: "backfilling_turbine"
    },
    {
        label: "Platform",
        key: "platform"
    },
];


export const STATUS_OPTIONS = [{
        label: "In Progress",
        value: "in_progress"
    },
    {
        label: "Completed",
        value: "completed"
    },
];


export const FILE_TYPE_CHOICES = [{
        value: "CERTIFICATE",
        label: "Certificate"
    },
    {
        value: "DOCUMENT",
        label: "Document"
    },
    {
        value: "PHOTO",
        label: "Photo"
    },
    {
        value: "EXCEL",
        label: "Excel"
    },
];

export const PLATFORM_TYPE_OPTIONS = [{
        value: "main_crane",
        label: "Main Crane"
    },
    {
        value: "tail_crane",
        label: "Tail Crane"
    },
];

export const PLATFORM_SHAPE_OPTIONS = [{
        value: "square",
        label: "Square"
    },
    {
        value: "rectangular",
        label: "Rectangular"
    },
    {
        value: "circular",
        label: "Circular"
    },
    {
        value: "irregular",
        label: "Irregular"
    },
];

export const yardOptions = [{
        id: "chakan",
        label: "Pune - Chakan Yard"
    },
    {
        id: "ranjangaon",
        label: "Pune - Ranjangaon Yard"
    },
    {
        id: "hinjewadi",
        label: "Pune - Hinjewadi Yard"
    },
    {
        id: "talegaon",
        label: "Pune - Talegaon Yard"
    },
];