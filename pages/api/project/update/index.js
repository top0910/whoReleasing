
import nextConnect from 'next-connect';
import HttpStatus from 'http-status-codes'
const uuidv4 = require("uuid").v4
import dbConnect from '../../../../lib/dbConnect'
import ProjectModel from '../../../../models/project'
import ProjectImgModel from '../../../../models/projectImg'
import fs from "fs"
import middleware from "../../../../lib/middleware/middleware"


const handler = nextConnect();
handler.use(middleware);


handler.post(async(req, res) =>{

    const {
        _id,
        name,
        // discordUsername,
        collectionCount,
        blockchainType,
        saleStatusType,
        description,
        approved,
        presale,
        publicsale,
        socialInformation,
        services,
        hasPresale,
        paymentComplete
    } = req.body


    //Validate all data is here
    try{

        if(_id=="" ||name==""  || Number(collectionCount)<1 || blockchainType=="" || saleStatusType=="" || description =="" || hasPresale==""){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }

        if(hasPresale == "true"){
            if(!presale || Number(presale.price) <0 || presale.date =="" || presale.time==""){
                res.status(HttpStatus.BAD_REQUEST).json({success:false})
                return
            }
        }

        if( !publicsale || Number(publicsale.price) <0 || publicsale.date =="" ||publicsale.time=="" ){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
        if(!socialInformation || socialInformation.email ==""){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
        if(!services || services.featuredRequested == "" || services.twitterShoutout == ""||services.discordShoutout == ""||services.frontPageRequested == ""||services.growthInterest==""){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }

        //optionals
        if(services.featuredRequested=="true"){
            if(!services.featuredRequestedStartDate || services.featuredRequestedStartDate==""||!services.featuredRequestedEndDate || services.featuredRequestedEndDate==""){
                res.status(HttpStatus.BAD_REQUEST).json({success:false})
                return
            }
        }
        if(services.frontPageRequested=="true"){
            if(!services.frontPageRequestedStartDate || services.frontPageRequestedStartDate=="" || !services.frontPageRequestedEndDate || services.frontPageRequestedEndDate==""){
                res.status(HttpStatus.BAD_REQUEST).json({success:false})
                return
            }
        }
    }catch(e){
        console.log(e)
        res.statusCode(HttpStatus.BAD_REQUEST).json({success:false})
        return
    }
    
    const update = {
        name,
        hasPresale,
        // discordUsername,
        collectionCount,
        blockchainType,
        saleStatusType,
        description,
        presale,
        publicsale,
        socialInformation,
        services,
        approved,
        paymentComplete
    }
    //If new image sent 
    try{
        if(req.files.image){
            var newProjectImg = new ProjectImgModel
            newProjectImg.img.data = fs.readFileSync(req.files.image.filepath)
            newProjectImg.img.contentType = 'image/jpeg';
            await newProjectImg.save();

            update.imageUrl = req.files.image.filepath
            update.imageName = req.files.image.newFilename
            update.imageId = newProjectImg._id
        }

        // Passed validation, Upload
        await dbConnect()
        try{       
            let updatedProject = await ProjectModel.findOneAndUpdate({_id:_id},{$set:update},{new:1})
            console.log("Updated")
            res.json({success:true,data:updatedProject})
        }catch(e){ 
            console.log(e)
            res.json({success:false})
        }
    }catch(e){
        console.log(e)
        res.json({success:false})
    }
      
})




//Turn off default
export const config = {
    api: {
      bodyParser: false,
    },
}
export default handler;


