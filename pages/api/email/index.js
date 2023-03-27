import HttpStatus from 'http-status-codes'
import dbConnect from '../../../lib/dbConnect'
import EmailModel from "../../../models/email"


export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'POST': {
            return saveEmail(req, res);
        }
        
    }
    
}

const saveEmail = async(req,res)=>{
    let email = req.body.email || ""
    if(email == "" || !email.includes("@")){
        res.status(HttpStatus.BAD_REQUEST).json({success:false,error:"Invalid email"})
        return
    }
    await dbConnect()
    //Check if already have
    let findEmail =await EmailModel.findOne({email:email},{email:1})
    if(findEmail){
        res.status(HttpStatus.NOT_ACCEPTABLE).json({success:false,error:"Email already exist"})
        return
    }else{
        const newEmail = new EmailModel({email:email})
        await newEmail.save()
        console.log("Saved email ",email)
        res.status(HttpStatus.ACCEPTED).json({success:true})
    }
}