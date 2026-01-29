/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Use VITE_API_BASE_URL in production (set in Vercel/hosting env). Default to localhost for dev.
// const RAILWAY_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
const RAILWAY_BASE_URL = "https://auto1-server.onrender.com"; 

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
    url: `${RAILWAY_BASE_URL}/category`,
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
    url: `${RAILWAY_BASE_URL}/category`,
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
    url: `${RAILWAY_BASE_URL}/category`,
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
      url: `${RAILWAY_BASE_URL}/auto/ai`,
      headers: { "Content-Type": "application/json" },
      data: input,
    };
    try {
        const response = await axios.request(config);
        // If ai is already an object, return it directly; otherwise parse it as JSON string
        if (typeof response.data.ai === 'string') {
          return JSON.parse(response.data.ai);
        }
        return response.data.ai;
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
    url: `${RAILWAY_BASE_URL}/sub-category/${subCategoryId}`,
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
    url: `${RAILWAY_BASE_URL}/sub-category`,
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
    url: `${RAILWAY_BASE_URL}/sub-category`,
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
      url: `${RAILWAY_BASE_URL}/file`,
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
      url: `${RAILWAY_BASE_URL}/file/${subCategoryId}`,
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
      url: `${RAILWAY_BASE_URL}/file/${fileId}`,
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
    url: `${RAILWAY_BASE_URL}/auto/format`,
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

  /**
 * Add a new category.
 * @param input - Description or prompt for the category
 */
  export const getCompanyInfo = async (
    input: any,
  ): Promise<any> => {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${RAILWAY_BASE_URL}/auto/company-info`,
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
