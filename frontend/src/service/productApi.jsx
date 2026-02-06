import API from "./api";

export const getProducts = async (params = {}) => {
  const res = await API.get("/products", {
    params, 
  });
  return res.data;
};

export const getProductId = async(productId)=>{
      const res = await API.get(`/products/${productId}`, productId)
      return res.data
}

export const createProduct = async(formData)=>{
      const res = await API.post('/products', formData, {
            headers:{
                  'Content-Type': "multipart/form-data"
            },
      });
      return res.data
}

export const updateProduct = async(id, formData)=>{
      const res = await API.put(`/products/${id}`, formData , {
            headers:{
                  'Content-Type': "multipart/form-data"
            },
      })
      return res.data
}


export const deleteProduct = async(productId)=>{
      const res = await API.delete(`/products/${productId}`)
      return res.data
}
