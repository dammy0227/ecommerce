import User from "../models/User.js";

export const getUserProfile = async(req,res)=>{
      try {
            const user = await User.findById(req.user.id).select('-password')
            if(!user){
                  return res.status(404).json({message: 'User not Found'})
            }
            res.status(201).json(user)
      } catch (error) {
             console.error("Get Profile Error:", error);
             res.status(500).json({ message: "Server error" });
      }
}

export const getAllUser = async(req, res)=>{
      try {
            const users = await User.find().select('-password')
            res.status(201).json(users)
      } catch (error) {
             console.error("Get All User Error:", error);
             res.status(500).json({ message: "Server error" });
      }
}


export const updateUser = async(req, res)=>{
      try {
            const {fullName, email} = req.body
            const user = await User.findById(req.user.id)
            if(!user){
                  res.status(404).json({message: 'user not found'})
            }

            user.fullName = fullName || user.fullName;
            user.email = email || user.email;

            const updateUser = await user.save()

            res.status(201).json({
                  message: 'User Updated Successfully',
                  user : {
                        id: updateUser.id,
                        fullName: updateUser.fullName,
                        email: updateUser.email,
                        role: updateUser.role
                  }
            })
      } catch (error) {
              console.error("Update Profile Error:", error);
              res.status(500).json({ message: "Server error" })
      }
}