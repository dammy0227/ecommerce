import API from "./api";

export const getCart = async () => {
  const res = await API.get('/cart');
  return res.data;
};


export const getAllCarts = async () => {
  const res = await API.get('/cart/all'); 
  return res.data;
};


export const addCart = async (data) => {
  const res = await API.post('/cart/add', data);
  return res.data;
};

export const updateCart = async (data) => {
  const res = await API.put('/cart/update', data);
  return res.data;
};


export const removeCart = async (data) => {
  const res = await API.delete('/cart/remove', {data});
  return res.data;
};

export const clearCart = async () => {
  const res = await API.delete('/cart/clear');
  return res.data;
};
