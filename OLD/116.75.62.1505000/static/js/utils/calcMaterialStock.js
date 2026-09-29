export const calculateMaterialStock = (
    receivedData,
    issueData,
    returnNotes,
    rejectNotes
) => {

    // 🔵 Build fast lookup maps
    const issueMap = {};
    const returnMap = {};
    const rejectMap = {};

    issueData.forEach((i) => {
        if (!issueMap[i.received]) issueMap[i.received] = [];
        issueMap[i.received].push(i);
    });

    returnNotes.forEach((r) => {
        if (!returnMap[r.issue]) returnMap[r.issue] = [];
        returnMap[r.issue].push(r);
    });

    rejectNotes.forEach((r) => {
        if (!rejectMap[r.issue]) rejectMap[r.issue] = [];
        rejectMap[r.issue].push(r);
    });

    // 🔵 Final stock calculation
    return receivedData.map((row) => {
        const issues = issueMap[row.id] || [];

        const totalIssued = issues.reduce(
            (sum, i) => sum + Number(i.quantity || 0),
            0
        );

        const totalReturned = issues.reduce((sum, issue) => {
            const ret = returnMap[issue.id] || [];
            return sum + ret.reduce((s, r) => s + Number(r.return_qty || 0), 0);
        }, 0);

        const totalRejected = issues.reduce((sum, issue) => {
            const rej = rejectMap[issue.id] || [];
            return sum + rej.reduce((s, r) => s + Number(r.reject_qty || 0), 0);
        }, 0);

        const balance =
            Number(row.quantity || 0) -
            totalIssued -
            totalRejected +
            totalReturned;

        return {
            ...row,
            total_issued: totalIssued,
            total_returned: totalReturned,
            total_rejected: totalRejected,
            balance_qty: balance,
            received_id: row.id,
            issues
        };
    });
};