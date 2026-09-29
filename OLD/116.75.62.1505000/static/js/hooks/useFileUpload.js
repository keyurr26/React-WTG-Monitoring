import {
    useDispatch
} from "react-redux";
import {
    CreateDocumentUpload
} from "../Redux/MasterData/masterAction";

export const useFileUpload = (filters) => {
    const dispatch = useDispatch();

    const uploadAttachments = async (
        formDataState,
        activityStatus,
        selectedTurbine = null,
    ) => {
        if (!formDataState.selected_items ? .length) {
            return Promise.resolve();
        }

        // Validation
        const invalidItems = formDataState.selected_items.filter(
            (item) =>
            item.file &&
            !item.file.isExisting &&
            !(item.file instanceof File || item.file instanceof Blob) &&
            (!item.custom_name || !item.doc_no || !item.doc_date),
        );

        if (invalidItems.length > 0) {
            throw new Error(
                "Please fill document name, document number and document date before uploading.",
            );
        }

        // Filter items that actually need saving
        const itemsToUpload = formDataState.selected_items.filter((item) => {
            if (item.file instanceof File || item.file instanceof Blob) {
                return true;
            }
            if (!item.documentId &&
                (item.custom_name || item.doc_no || item.doc_date || item.remarks)
            ) {
                return true;
            }
            return false;
        });

        const uploadPromises = itemsToUpload.map((item) => {
            const fd = new FormData();

            // Append file only if a new file is provided
            if (item.file instanceof File || item.file instanceof Blob) {
                fd.append("file", item.file);
            }

            fd.append("name", item.custom_name || "");
            fd.append("doc_no", item.doc_no || "");
            fd.append("doc_date", item.doc_date || "");
            fd.append("remarks", item.remarks || "");
            fd.append("activity_status", activityStatus);

            // ================= ALWAYS CREATE NEW =================
            fd.append("project", filters.project || "");
            fd.append("windfarm", filters.windfarm || "");
            fd.append("cluster", selectedTurbine ? .cluster || filters ? .cluster || "");
            fd.append("turbine", formDataState.turbine || "");
            fd.append("attachment_master", item.masterId);
            fd.append("is_deleted", "false");
            fd.append("is_active", "true");

            return dispatch(CreateDocumentUpload(fd));
        });

        return Promise.all(uploadPromises);
    };

    return {
        uploadAttachments,
    };
};