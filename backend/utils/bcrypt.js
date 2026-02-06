import bcrypt from "bcryptjs";

const saltRound = 10

export const hashPassword = async(password) =>{
      return await bcrypt.hash(password,saltRound)
}

export const comparePassword = async(plainPassword, hashPassword)=>{
      return await bcrypt.compare(plainPassword, hashPassword)
}