
import nextConnect from 'next-connect';
import HttpStatus from 'http-status-codes'
const uuidv4 = require("uuid").v4
import dbConnect from '../../../../lib/dbConnect'
import NewsModel from '../../../../models/news'
import ProjectImgModel from '../../../../models/projectImg'
import middleware from "../../../../lib/middlewareNews/middleware"
import fs from "fs"


const handler = nextConnect();
handler.use(middleware);


handler.post(async(req, res) =>{

    const {
        _id,
        title,
        discordLink,
        twitterLink,
        tags,
        markdown
    } = req.body

    

    //Validate all data is here
    try{

        if(!_id ||!title|| !markdown || _id=="" ||title==""||markdown=="" ){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }

    }catch(e){
        console.log(e)
        res.statusCode(HttpStatus.BAD_REQUEST).json({success:false})
        return
    }
    
    const update = {
        title,
        discordLink,
        twitterLink,
        tags,
        markdown
    }
    try{

        //If new image sent 
        if(req.files.coverImage){
            var newCoverImg = new ProjectImgModel
            newCoverImg.img.data = fs.readFileSync(req.files.coverImage.filepath)
            newCoverImg.img.contentType = 'image/jpeg';
            await newCoverImg.save();

            update.coverImageUrl = req.files.coverImage.filepath
            update.coverImageName = req.files.coverImage.newFilename
            update.coverImageId = newCoverImg._id
        }

        if(req.files.displayImage){
            var newDisplayImg = new ProjectImgModel
            newDisplayImg.img.data = fs.readFileSync(req.files.displayImage.filepath)
            newDisplayImg.img.contentType = 'image/jpeg';
            await newDisplayImg.save();

            update.displayImageUrl = req.files.displayImage.filepath
            update.displayImageName = req.files.displayImage.newFilename
            update.displayImageId = newDisplayImg._id
        }

    }catch(e){
        console.log(e)
        res.json({success:false,error:e.message})
    }
    

    // Passed validation, Upload
    await dbConnect()
    try{
        
        let updatedNews = await NewsModel.findOneAndUpdate({_id:_id},{$set:update},{new:1})
        console.log("Updated")
        res.json({success:true,data:updatedNews})

    }catch(e){ 
        console.log(e)
        res.json({success:false,error:e.message})

    }

    // try{
    //     const newProjectData = new ProjectModel({
    //         id:uuidv4(),
    //         name,
    //         discordUsername,
    //         collectionCount,
    //         blockchainType,
    //         saleStatusType,
    //         description,
    //         presale,
    //         publicsale,
    //         socialInformation,
    //         services,
    //         imageUrl:image.filepath,
    //         imageName:image.newFilename
    //     })
    //     await newProjectData.save()
    //     res.status(HttpStatus.ACCEPTED).json({success:true})
    //     console.log("success")

    // }catch(e){
    //     console.log(e)
    //     console.log("failed")
    //     res.status(HttpStatus.BAD_REQUEST).json({success:false})
    // }
    
})




//Turn off default
export const config = {
    api: {
      bodyParser: false,
    },
}
export default handler;


