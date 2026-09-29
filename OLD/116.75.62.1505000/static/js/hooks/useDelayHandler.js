import {
    useState,
    useCallback
} from "react";
import {
    useDispatch
} from "react-redux";
import {
    checkDelayStatus
} from "../Redux/InstallationData/FoundationData/foundationAction";
const useDelayHandler = ({
    activityCode,
    onDelaySubmit
}) => {
    const dispatch = useDispatch();
    const [delayOpen, setDelayOpen] = useState(false);
    const [delayData, setDelayData] = useState(null);
    const [delaySaved, setDelaySaved] = useState(true);
    const resolveStatusString = (statusInput) => {
        if (typeof statusInput === "boolean") {
            return statusInput ? "completed" : "in_progress";
        }

        if (typeof statusInput === "string" && statusInput.trim() !== "") {
            return statusInput;
        }

        if (typeof statusInput === "object" && statusInput !== null) {
            const statusKey = Object.keys(statusInput).find(
                (key) => key.endsWith("_status") || key === "status",
            );

            return statusKey && statusInput[statusKey] ?
                statusInput[statusKey] :
                "in_progress";
        }

        return "in_progress";
    };

    const checkDelay = useCallback(
        async (date, turbineId, statusInput = false, extraParams = {}) => {
            if (!date || !turbineId) return false;
            const rawStatus = resolveStatusString(statusInput);
            // const isCompleted = String(rawStatus).toLowerCase() === "completed";
            // 1. Dispatch checkDelayStatus WITH status query param
            const result = await dispatch(
                checkDelayStatus({
                    turbine: turbineId,
                    activity: activityCode,
                    delay_log_date: date,
                    status: rawStatus,
                    ...extraParams,
                }),
            );
            if (!result) return false;
            const startingDelay = result.starting_delay_days || 0;
            let workingDelay = result.working_delay_days || 0;
            const hasActiveDelay = startingDelay > 0 || workingDelay > 0;
            if (!hasActiveDelay) {
                setDelaySaved(true);
                setDelayData(null);
                setDelayOpen(false);
                return false;
            }
            const activeDelayDays = startingDelay > 0 ? startingDelay : workingDelay;
            setDelayData({
                id: result.delay_id,
                starting_delay_days: startingDelay,
                working_delay_days: workingDelay,
                delay_days: activeDelayDays,
                delay_log_date: date,
                turbine: turbineId,
                planned_activity: result.planned_activity_id,
                activity: activityCode,
                delay_cause: result.delay_cause || "",
                description: result.description || "",
                ...extraParams,
            });
            setDelaySaved(!!result.delay_id);
            setDelayOpen(true);
            return true;
        },

        [dispatch, activityCode],
    );
    const handleDelaySubmit = async (extraData) => {
        try {
            // Catch what the parent function returns
            const res = await onDelaySubmit({
                ...delayData,
                ...extraData,
            });

            // If res evaluates truthy (meaning it didn't return false/falsy)
            if (res) {
                // Extract saved data (handling standard Redux toolkit unwrapped payloads or wrapped formats)
                const savedRecord = res ? .data || res;

                setDelayData((prev) => ({
                    ...prev,
                    // CRITICAL: Bind the database ID so subsequent opens treat it as an existing record
                    id: savedRecord ? .id || prev ? .id || extraData ? .id,
                    delay_cause: extraData.delay_cause,
                    description: extraData.description,
                }));

                setDelaySaved(true);
                setDelayOpen(false);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Delay submit failed", err);
            return false;
        }
    };
    return {
        delayOpen,
        delayData,
        delaySaved,
        checkDelay,
        handleDelaySubmit,
        openDelayPopup: () => setDelayOpen(true),
        closeDelayPopup: () => setDelayOpen(false),
        clearDelay: () => {
            setDelayOpen(false);
            setDelayData(null);
            setDelaySaved(true);
        },
    };
};

export default useDelayHandler;