import React, {
    createContext,
    useContext
} from "react";

/**
 * Dynamically checks window.appConfig every single time it is called.
 */
export const getDateLimits = (customDaysBack) => {
    // Always evaluate window.appConfig dynamically at runtime
    const globalDaysBack = window.appConfig ? .daysBackLimit ? ? 4;
    const daysBack =
        customDaysBack !== undefined ? customDaysBack : globalDaysBack;

    const now = new Date();
    const minDateObj = new Date();
    minDateObj.setDate(now.getDate() - daysBack);

    const toDate = (d) => d.toISOString().split("T")[0];
    const toDateTime = (d) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d - offset).toISOString().slice(0, 16);
    };

    return {
        date: {
            min: toDate(minDateObj),
            max: toDate(now)
        },
        dateTime: {
            min: toDateTime(new Date(minDateObj.setHours(0, 0, 0, 0))),
            max: toDateTime(new Date(now.setHours(23, 59, 0, 0))),
        },
    };
};

const DateLimitContext = createContext();

export const DateLimitProvider = ({
    children
}) => {
    return ( <
        DateLimitContext.Provider value = {
            {
                // Dynamically getter for default days back
                get defaultDaysBack() {
                    return window.appConfig ? .daysBackLimit ? ? 4;
                },
                calculateLimits: getDateLimits,
            }
        } >
        {
            children
        } <
        /DateLimitContext.Provider>
    );
};

export const useDateLimits = (customDaysBack) => {
    const {
        defaultDaysBack
    } = useContext(DateLimitContext);
    // Evaluates dynamically on every hook call/render
    const daysBack =
        customDaysBack !== undefined ? customDaysBack : defaultDaysBack;

    return {
        limits: getDateLimits(daysBack),
        daysBack,
    };
};

// /**
//  * Returns an object with min and max date strings for HTML5 date inputs
//  * @param {number} daysBack - Number of days allowed in the past
//  * @returns { min: string, max: string }
//  */
// export const getDateLimits = (daysBack = 0) => {
// //     const today = new Date();

// //     // Calculate Min Date
// //     const minDateObj = new Date();
// //     minDateObj.setDate(today.getDate() - daysBack);

// //     return {
// //         min: minDateObj.toISOString().split("T")[0], // YYYY-MM-DD
// //         max: today.toISOString().split("T")[0]       // YYYY-MM-DD (Today)
// //     };
// // };

// const now = new Date();

//     // Min Date (X days ago)
//     const minDateObj = new Date();
//     minDateObj.setDate(now.getDate() - daysBack);

//     // Formatters
//     const toDate = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD
//     const toDateTime = (d) => {
//         const offset = d.getTimezoneOffset() * 60000;
//         return new Date(d - offset).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
//     };

//     return {
//         // Use these for type="date"
//         date: {
//             min: toDate(minDateObj),
//             max: toDate(now)
//         },
//         // Use these for type="datetime-local"
//         dateTime: {
//             min: toDateTime(new Date(minDateObj.setHours(0,0,0,0))),
//             max: toDateTime(new Date(now.setHours(23,59,0,0)))
//         }
//     };
// };