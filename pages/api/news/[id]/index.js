
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../../lib/dbConnect'
import NewsModel from "../../../../models/news"
export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getNews(req, res);
        }
        
    }
}

const getNews = async (req,res)=>{
    const newsId = req.query.id


    try{
        await dbConnect()
        const foundNews= await NewsModel.findOne({_id:newsId})
        if(foundNews){
            res.status(HttpStatus.ACCEPTED).json({success:true,data:foundNews})
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({success:false,error:"No Data Found"})
        }
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false,error:e.message})

    }
    
}