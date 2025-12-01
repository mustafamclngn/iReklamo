import { axiosPrivate } from "./axios";

const barangaysApi = {
  getAllBarangays: async () => {
    const response = await axiosPrivate.get("/api/barangays/");
    return response.data;
  },

  getBarangaysDetails: async () => {
    const response = await axiosPrivate.get("/api/barangays/details");
    return response.data;
  },

  getBarangayById: async (id) => {
    const response = await axiosPrivate.get(`/api/barangays/${id}`);
    return response.data;
  },
};

export default barangaysApi;
