/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Generic function to handle API requests.
 * @param config - Axios request configuration
 * @returns Promise with the API response data
 */
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get all categories.
 */
export const getCategories = async (): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://auto1-server.onrender.com/category",
    headers: {},
  };
  return apiRequest(config);
};

/**
 * Add a new category.
 * @param name - Name of the category
 * @param prompt - Description or prompt for the category
 */
export const addCategory = async (
  name: string,
  prompt: string
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://auto1-server.onrender.com/category",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ name, prompt }),
  };
  return apiRequest(config);
};

/**
 * Add a update category.
 * @param id - id of the category
 * @param prompt - Description or prompt for the category
 */
export const updateCategory = async (
  id: string,
  prompt: string
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "put",
    maxBodyLength: Infinity,
    url: "https://auto1-server.onrender.com/category",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ id, prompt }),
  };
  return apiRequest(config);
};

/**
 * Add a new category.
 * @param input - Description or prompt for the category
 */
export const generateResponse = async (
    input: any,
  ): Promise<any> => {
    const config: AxiosRequestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://auto1-server.onrender.com/auto/ai",
      headers: { "Content-Type": "application/json" },
      data: input,
    };
    try {
        const response = await axios.request(config);
        console.log('response.data', JSON.parse(response.data.ai))
        return JSON.parse(response.data.ai);
      } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        alert(error.message)
        throw error;
      }
  };

/**
 * Get sub-category by ID.
 * @param subCategoryId - ID of the sub-category
 */
export const getSubCategoryById = async (
  subCategoryId: string
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://auto1-server.onrender.com/sub-category/${subCategoryId}`,
    headers: {},
  };
  return apiRequest(config);
};

/**
 * Add a new sub-category.
 * @param name - Name of the sub-category
 * @param prompt - Description or prompt for the sub-category
 * @param categoryId - ID of the parent category
 */
export const addSubCategory = async (
  name: string,
  prompt: string,
  categoryId: string
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://auto1-server.onrender.com/sub-category",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ name, prompt, categoryId }),
  };
  return apiRequest(config);
};

/**
 * Add a new sub-category.
 * @param id - Name of the sub-category
 * @param prompt - Description or prompt for the sub-category
 * @param categoryId - ID of the parent category
 */
export const updateSubCategory = async (
  id: string,
  prompt: string,
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "put",
    maxBodyLength: Infinity,
    url: "https://auto1-server.onrender.com/sub-category",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ id, prompt }),
  };
  return apiRequest(config);
};
/**
 * Upload a file to a sub-category.
 * @param filePath - Path to the file to upload
 * @param subCategoryId - ID of the sub-category
 */
export const uploadFiles = async (
    files: File[],
    subCategoryId: string
  ): Promise<any> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("subCategoryId", subCategoryId);
  
    const config: AxiosRequestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://auto1-server.onrender.com/file", // Assuming backend expects "files" endpoint for multiple files
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
  
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      alert(error.message)
      throw error;
    }
  };
  


export const getFileBySubCategoryId = async (subCategoryId: string): Promise<any> => {
    const config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://auto1-server.onrender.com/file/${subCategoryId}`,
      headers: {},
    };
  
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      alert(error.message)
      throw error;
    }
  };
  

  export const deleteFileById = async (fileId: string): Promise<any> => {
    const config: AxiosRequestConfig = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://auto1-server.onrender.com/file/${fileId}`,
      headers: {},
    };
  
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      alert(error.message)
      throw error;
    }
  };



  /**
 * Add a new category.
 * @param input - Description or prompt for the category
 */
export const formatResponse = async (
  input: any,
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method: "post",
    url: "https://auto1-server.onrender.com/auto/format",
    headers: { "Content-Type": "application/json" },
    data: {text:input},
  };
  try {
      const response = await axios.request(config);
      console.log('response.data', response.data.ai)
      return response.data.ai;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      alert(error.message)
      throw error;
    }
};