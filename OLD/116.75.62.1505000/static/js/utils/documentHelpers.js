export const getAttachmentsForActivity = (activityCode, turbineId, documentList) => {
    if (!documentList || !Array.isArray(documentList)) return [];

    return documentList
        .filter(doc =>
            doc.activity === activityCode &&
            Number(doc.turbine) === Number(turbineId)
        )
        .map((doc) => ({
            url: doc.file,
            name: doc.file_type || doc.name || doc.file.split("/").pop(),
            doc_no: doc.doc_no || "N/A",
            doc_date: doc.doc_date || "N/A",
            remarks: doc.remarks || ""
        }));
};