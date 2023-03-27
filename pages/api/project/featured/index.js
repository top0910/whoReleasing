
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../../lib/dbConnect'
import moment from 'moment';
import ProjectModel from "../../../../models/project"
export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getProject(req, res);
        }      
    }
}

const getProject = async (req,res)=>{
    // const {todaySting} = req.query

    // if(!today || today==""){
    //     res.status(HttpStatus.CONFLICT).json({success:false})
    //     return
    // }
    
    const today = moment()

    try{
        await dbConnect()
        const featuredProjects = await ProjectModel.find({
            "services.featureRequested":true,
            "services.featureRequestedStartDate":{$lte:today},
            "services.featureRequestedEndDate":{$gte:today},
            approved:true
        })
        res.status(HttpStatus.ACCEPTED).json({success:true,data:featuredProjects})

    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
    res.status(HttpStatus.CONFLICT).json({success:false})

}

