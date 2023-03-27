
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
        case 'DELETE': {
            return deleteProject(req, res);
        }
        
    }
}

const getProject = async (req,res)=>{
    const projectId = req.query.id

    try{
        await dbConnect()
        const foundProject = await ProjectModel.findOne({_id:projectId})
        if(foundProject){
            res.status(HttpStatus.ACCEPTED).json({success:true,data:foundProject})
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
        }
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
    
}

const deleteProject = async (req,res)=>{
    const projectId = req.query.id
    console.log(projectId)
    try{
        await dbConnect()
        const foundProject = await ProjectModel.findOneAndRemove({_id:projectId})
        console.log(foundProject)
        if(foundProject){
            res.status(HttpStatus.ACCEPTED).json({success:true,data:foundProject})
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
        }
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})
    }

}