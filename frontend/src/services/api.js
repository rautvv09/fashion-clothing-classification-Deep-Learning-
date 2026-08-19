import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const predictFashion = async (image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await API.post(
    "/predict",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};