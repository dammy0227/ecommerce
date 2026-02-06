import API from "./api";

export const profile = async()=>{
      const res = await API.get('/users/profile')
      return res.data
}

export const updateProfile = async(data)=>{
      const res = await API.put('/users/profile', data)
      return res.data
}

export const getAllUser = async()=>{
      const res = await API.get('/users')
      return res.data
}