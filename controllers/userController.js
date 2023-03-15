import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signUp = async(req,res)=>{
    const {firstName,lastName,email,password,confirmPassword} = req.body

    try {
        const isUserExists = await userModel.findOne({email})

        if(isUserExists) return res.json({message:'User Already Exists'})

        if(password !== confirmPassword) return res.status(404).json({message:'password does not match!'})

        const hashPassword = await bcrypt.hash(password,12)

        const result = await userModel.create({name:`${firstName} ${lastName}`,email,password:hashPassword,})

        const token = jwt.sign({email:result.email,id:result._id},'test',{expiresIn:'365d'})

        res.status(201).json({result,token})
        
    } catch (error) {
        res.status(500).json({error:'Something went wrong'})
    }
}

export const signIn = async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await userModel.findOne({email})

        if(!user) return res.json({message:'User does not Exists'})  

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if(!isPasswordCorrect) return res.json({message:'Invalid credentials'})

        const token = jwt.sign({email:user.email,id:user._id},'test',{expiresIn:'365d'})

        res.status(200).json({result:user,token})
    } catch (error) {
        res.status(500).json({error:'Something went wrong'})
    }
}