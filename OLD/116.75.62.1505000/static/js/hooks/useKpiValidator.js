// hooks/useKpiValidator.js
import {
    useMemo
} from "react";

const useKpiValidator = (kpiList, turbineId, fieldsToTrack) => {
    // Helper filter function placed at the top so it's in scope
    const rowsFilter = (rows, tId) => {
        return rows ? .filter((r) => Number(r.turbine) === Number(tId)) || [];
    };

    const kpiStatus = useMemo(() => {
        if (!turbineId || !kpiList || !fieldsToTrack) return {};

        const getKpiConfig = (field) => kpiList.find((k) => k.field_name === field);

        const results = {};
        fieldsToTrack.forEach((item) => {
            const config = getKpiConfig(item.field);
            if (config) {
                const history = rowsFilter(item.rows, turbineId);
                const current = parseFloat(item.state || 0);

                let actual = current;
                let dynamicMin = parseFloat(config.min_value || 0);
                let dynamicMax = parseFloat(config.max_value || 0);
                let isMinViolated = false;
                let isMaxViolated = false;

                if (item.type === "sum" || item.type === "cumulative") {
                    // Cumulative Sum calculation for Volume
                    const pastTotal = history.reduce(
                        (acc, r) => acc + parseFloat(r[item.field] || 0),
                        0,
                    );
                    actual = pastTotal + current;
                    isMinViolated = dynamicMin > 0 && actual < dynamicMin;
                    isMaxViolated = dynamicMax > 0 && actual > dynamicMax;
                } else if (item.type === "progressive") {
                    // Progressive check for Depth (cannot decrease from past records)
                    const previousMax =
                        history.length > 0 ?
                        Math.max(...history.map((r) => parseFloat(r[item.field] || 0))) :
                        0;

                    dynamicMin = Math.max(dynamicMin, previousMax);
                    actual = current;

                    isMinViolated = current < dynamicMin;
                    isMaxViolated = dynamicMax > 0 && current > dynamicMax;
                } else if (item.type === "max") {
                    actual = Math.max(
                        ...history.map((r) => parseFloat(r[item.field] || 0)),
                        current,
                        0,
                    );
                    isMinViolated = dynamicMin > 0 && actual < dynamicMin;
                    isMaxViolated = dynamicMax > 0 && actual > dynamicMax;
                } else {
                    actual = current;
                    isMinViolated = dynamicMin > 0 && actual < dynamicMin;
                    isMaxViolated = dynamicMax > 0 && actual > dynamicMax;
                }

                results[item.field] = {
                    actual,
                    min: dynamicMin,
                    max: dynamicMax,
                    msg: config.msg,
                    isError: isMinViolated || isMaxViolated,
                    label: item.id,
                };
            }
        });

        return results;
    }, [kpiList, turbineId, fieldsToTrack]);

    const validateKpi = (fieldName, showSnackbar) => {
        const status = kpiStatus[fieldName];
        if (status && status.isError) {
            if (showSnackbar)
                showSnackbar(
                    `${status.msg} (Current Total: ${status.actual}, Max Allowed: ${status.max})`,
                    "error",
                );
            return false;
        }
        return true;
    };

    return {
        kpiStatus,
        validateKpi
    };
};

export default useKpiValidator;