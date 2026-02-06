import jwt from 'jsonwebtoken'

export const generateToken = (payload)=>{
      return jwt.sign(payload, process.env.JWT_SECRET_KEY,{
            expiresIn: '7d'
      })
}

export const verify = (token)=>{
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
}