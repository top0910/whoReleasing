import HttpStatus from 'http-status-codes'
const uuidv4 = require("uuid").v4
import dbConnect from '../../../lib/dbConnect'
import ProjectModel from "../../../models/project"


export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getSuggestions(req, res);
        }
        
    }
    
}

const getSuggestions = async(req,res)=>{
    const text = req.query.text || ""
    const limit = req.query.limit || 5
    if(text==""){
        res.status(HttpStatus.BAD_REQUEST).json({success:false})
        return
    }
    await dbConnect()

     
    let regEx = new RegExp(`${text}`, "i");

    const suggested = await ProjectModel.find({"name":{$regex : regEx},"approved":true},{name:1,_id:1,imageName:1}).limit(limit)
    res.status(HttpStatus.ACCEPTED).json({success:true,data:suggested})

}