
import apiClient from "../services/apiClient";

export const get = (url, config) => apiClient.get(url, config);
export const post = (url, data, config) => apiClient.post(url, data, config);
export const put = (url, data, config) => apiClient.put(url, data, config);
export const patch = (url, data, config) => apiClient.patch(url, data, config);
export const del = (url, config) => apiClient.delete(url, config);

export default { get, post, put, patch, del };