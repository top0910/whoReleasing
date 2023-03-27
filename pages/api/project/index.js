
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../lib/dbConnect'
import moment from 'moment';
import ProjectModel from "../../../models/project"
export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getProjects(req, res);
        }
        
    }
}

const getProjects = async (req,res)=>{
    let params = req.query


    let filterDate = params.date
    try{
        await dbConnect()
        const filteredProjects = await ProjectModel.find({
            "publicsale.date":{
                $gte: moment(filterDate).startOf("day").toISOString(),
                $lte: moment(filterDate).endOf('day').toISOString()
            },
            approved:true
        },{description:0})
        
        res.status(HttpStatus.ACCEPTED).json({success:true,data:filteredProjects})
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
    
}