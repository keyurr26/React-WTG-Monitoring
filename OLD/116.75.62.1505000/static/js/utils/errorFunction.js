// // utils/errorFunction.js
// const parseErrorMessage = (errorData) => {
//   if (!errorData) return 'Unknown error occurred';

//   if (typeof errorData === 'string') return errorData;

//   if (typeof errorData === 'object') {
//     return Object.entries(errorData)
//       .map(([key, value]) => {
//         const formattedValue = Array.isArray(value) ? value.join(', ') : value;
//         return `${key}: ${formattedValue}`;
//       })
//       .join('\n'); // line by line
//   }

//   return 'An unexpected error occurred';
// };

// export default parseErrorMessage;
const parseErrorMessage = (errorData) => {

    if (!errorData) return "Unknown error occurred";

    if (typeof errorData === "string") return errorData;

    if (Array.isArray(errorData)) {

        return errorData.map(parseErrorMessage).join("\n");

    }

    if (typeof errorData === "object") {

        return Object.entries(errorData)

            .map(([field, value]) => {

                const label = field

                    .replace(/_/g, " ")

                    .replace(/\b\w/g, (c) => c.toUpperCase());

                if (Array.isArray(value)) {

                    return `${label}: ${value.join(", ")}`;

                }

                if (typeof value === "object" && value !== null) {

                    return `${label}: ${parseErrorMessage(value)}`;

                }

                return `${label}: ${value}`;

            })

            .join("\n");

    }

    return "An unexpected error occurred";

};

export default parseErrorMessage;