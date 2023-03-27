
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../../lib/dbConnect'
import AdminModel from "../../../../models/admin"
import Bcrypt from "bcryptjs";

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'POST': {
            return createAdmin(req, res);
        }
        case "Get" :{
            return loginAdmin(req,res)
        }
        
    }
}

const createAdmin = async (req,res)=>{
    const {username,password} = req.body
    console.log(username)

    if(!username || !password || username==""||password==""){
        res.status(HttpStatus.CONFLICT).json({success:false})
        return
    }
    const encryptPass = Bcrypt.hashSync(password, 10);

    try{
        await dbConnect()
        const newAdmin = new AdminModel({
            username,
            password:encryptPass

        })
        const saved = await newAdmin.save()
        res.status(HttpStatus.ACCEPTED).json({success:true,data:saved})

    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false,error:e.message})
    }
    
}

const loginAdmin = async (req,res)=>{
    const {username,password} = req.body
    if(!username || !password || username==""||password==""){
        res.status(HttpStatus.CONFLICT).json({success:false})
        return
    }


    try{   
        await dbConnect()
        const foundAdmin = await AdminModel.findOne({username:username})
        try{
            if(!foundAdmin) {
                return res.json({success:false,error:"User credentials incorrect"})
            }
            if(!Bcrypt.compareSync(password, foundAdmin.password)) {
                return res.json({ success:false,error:"User credentials incorrect" });
            }
            res.json({success:true,data:foundAdmin})
            console.log(`${username} : Admin succesfully Logged in.`)
        }catch(e){
            console.log(err)
            res.json({success:false,error:e.message})
        }
    }catch(e){
        console.log(e)
        res.json({success:false,error:e.message})
    }     

}