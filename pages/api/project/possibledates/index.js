
import HttpStatus from 'http-status-codes'
const uuidv4 = require("uuid").v4
import dbConnect from '../../../../lib/dbConnect'
import moment from 'moment';
import ProjectModel from "../../../../models/project"
export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getDates(req, res);
        }
        
    }
}

const getDates = async (req,res)=>{
    let params = req.query


    let filterDate = params.date? moment(params.date) : null
    try{
        await dbConnect()
        const filteredPossibleDates= await ProjectModel.distinct("publicsale.date",{
            "publicsale.date":{$gte: moment(filterDate).startOf("day").toISOString()}
        })
        
        res.status(HttpStatus.ACCEPTED).json({success:true,data:filteredPossibleDates})
    }catch(e){
        console.log(e)
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
    
}