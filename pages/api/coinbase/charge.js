import HttpStatus from 'http-status-codes'
import dbConnect from '../../../lib/dbConnect'
import {Client ,resources } from "coinbase-commerce-node"

Client.init(process.env.NEXT_PUBLIC_COINBASE_API)

const {Charge,Checkout} = resources

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'POST': {
            return createCharge(req, res);
        }
        
    }
    
}

const createCharge = async(req,res)=>{
    const {price,description,projectId} = req.body
    if(!price || !description ||description=="" || !projectId || projectId==""){
        res.json({success:false,error:"Missing Data"})  
        return
    }

    try{
        await dbConnect()
        const chargeData  = {
            name:"Who's Launching",
            description:description,
            local_price:{
                amount:price,
                currency:"eth"
            },
            pricing_type: "fixed_price",
            metadata:{
                projectId
            },
            'requested_info': ['name', 'email'],
            "redirect_url": `https://whoslaunching.com/submitproject/verifypayment?pid=${projectId}`,
        }
    
        const chargeObj = await Charge.create(chargeData)
        res.json({success:true,data:chargeObj})  
    }catch(e){
        console.log(e)
        res.json({success:false,error:"Error cresting charge"})  
    }
     
}