
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../../lib/dbConnect'
import moment from 'moment';
import ProjectModel from "../../../../models/project"
export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getPaymentStatus(req, res);
        }
        
    }
}

const getPaymentStatus = async (req,res)=>{
    let params = req.query
    let {id} = params

    try{
        await dbConnect()
        //Get payment status
        let foundProject = await ProjectModel.findOne({_id:id},{paymentComplete:1,name:1})
        if(foundProject){
            res.status(HttpStatus.ACCEPTED).json({success:true,data:foundProject})
        }else{
            res.status(HttpStatus.CONFLICT).json({success:false,error:"No project found"})
        }
        
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false,error:"Server error"})
    }
    
}