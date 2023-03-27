
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../../lib/dbConnect'
import moment from 'moment';
import ProjectModel from "../../../../models/project"
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
    let filterLimit = params.limit? params.limit : null
    let filterSkip = params.skip? params.skip : null
    let extraQuery = {}

    if(filterLimit) extraQuery.limit = filterLimit
    if(filterSkip) extraQuery.skip = filterSkip

    try{
        await dbConnect()
        const filteredProjects = await ProjectModel.find({},{},extraQuery)
        console.log(filteredProjects)
        res.status(HttpStatus.ACCEPTED).json({success:true,data:filteredProjects})
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
}