import axiosInstance from './axiosInstance';

// GET Request
export const GetDataApiWTGM = async (url, config = {}) => {
    try {
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// POST Request
// ✅ handles both JSON and FormData automatically
export const PostDataApiWTGM = async (url, data) => {
    try {
        const isFormData = data instanceof FormData;

        const response = await axiosInstance.post(url, data, {
            headers: isFormData ? {} : {
                'Content-Type': 'application/json'
            },
            // empty headers for FormData
        });

        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
};


// PUT Request
export const PutDataApiWTGM = async (url, data) => {
    try {
        const isFormData = data instanceof FormData;

        const response = await axiosInstance.put(url, data, {
            headers: isFormData ? {} : {
                'Content-Type': 'application/json'
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// PATCH Request
export const PatchDataApiWTGM = async (url, data) => {
    try {
        const isFormData = data instanceof FormData;

        const response = await axiosInstance.patch(url, data, {
            headers: isFormData ? {} : {
                'Content-Type': 'application/json'
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// DELETE Request
export const DeleteDataApiWTGM = async (url, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};