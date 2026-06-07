import axios from "axios";

const API_BASE_URL = "https://saledos-1.onrender.com/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Add an interceptor to handle FormData automatically
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // When sending FormData, let the browser/Axios set the Content-Type with the boundary
    delete config.headers["Content-Type"]
  }
  return config
})

// Categories Endpoints


export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await api.post("/categories", { name });
  return response.data;
};

export const updateCategory = async (id: string, name: string) => {
  const response = await api.put("/categories", { id, name });
  return response.data;
};

export const deleteCategory = async (id: string) => {
  console.log(id)
  const response = await api.delete("/categories",  {data:{ id:id }} )
  return response.data
}

// Users Endpoints
export const getUsers = async () => {
  const response = await api.get("/users")
  return response.data
}

export const createUser = async (data: any) => {
  // User model doesn't have password field
  const { password, ...safeData } = data
  const response = await api.post("/users", safeData)
  return response.data
}

export const updateUser = async (id: string, data: any) => {
  const { password, ...safeData } = data
  // Using both URL param and body for maximum backend compatibility
  const response = await api.put(`/users/${id}`, { id, ...safeData })
  return response.data
}

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`, { data: { id } });
  return response.data;
};

// Sellers Endpoints
export const getSellers = async () => {
  const response = await api.get("/seller");
  return response.data;
};

export const createSeller = async (formData: FormData) => {
  const response = await api.post("/seller", formData)
  return response.data
}

export const updateSeller = async (id: string, formData: FormData) => {
  if (formData instanceof FormData && !formData.has("id")) {
    formData.append("id", id)
  }
  const response = await api.put(`/seller/${id}`, formData)
  return response.data
}

export const deleteSeller = async (id: string) => {
  const response = await api.delete(`/seller/${id}`, { data: { id } });
  return response.data;
};

// Sales Endpoints
export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data;
};

export const createSale = async (sellerId: string, formData: FormData) => {
  const response = await api.post(`/sales/${sellerId}`, formData)
  return response.data
}

export const updateSale = async (saleId: string, formData: FormData) => {
  const response = await api.put(`/sales/put/${saleId}`, formData)
  return response.data
}

export const deleteSale = async (saleId: string) => {
  const response = await api.delete(`/sales/${saleId}`, { data: { id: saleId } })
  return response.data
}

// Carusel Endpoints
export const getCarusels = async () => {
  const response = await api.get("/carusel")
  return response.data
}

export const createCarusel = async (carusels: { image: string; saleId: string }[]) => {
  const response = await api.post("/carusel", { carusels })
  return response.data
}

export const updateCarusel = async (id: string, data: { image?: string; saleId?: string }) => {
  const response = await api.put(`/carusel/${id}`, data)
  return response.data
}

export const deleteCarusel = async (id: string) => {
  const response = await api.delete(`/carusel/${id}`)
  return response.data
}
