import API from "./api";

export const createOrder = async(data)=>{
      const res = await API.post('/orders', data)
      return res.data
}

export const getMyOrder = async()=>{
      const res = await API.get('/orders/my-orders')
      return res.data
}

export const getOrderById = async(orderId)=>{
      const res = await API.get(`/orders/${orderId}`)
      return res.data
}

export const updatePaymentStatus = async (orderId) => {
  const res = await API.put(`/orders/${orderId}/payment`); // Fixed endpoint
  return res.data;
};

export const updateOrderStatus = async (orderId, data) => {
  const res = await API.put(`/orders/${orderId}/status`, data); // Fixed parameter
  return res.data;
};

export const cancelOrder = async(orderId)=>{
      const res = await API.put(`/orders/${orderId}/cancel`)
      return res.data
}


export const getAllOrders = async () => {
  const res = await API.get('/orders/all/orders');
  return res.data;
};