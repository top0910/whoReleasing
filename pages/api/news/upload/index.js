
import nextConnect from 'next-connect';
import HttpStatus from 'http-status-codes'
const uuidv4 = require("uuid").v4
import dbConnect from '../../../../lib/dbConnect'
import NewsModel from '../../../../models/news'
import middleware from "../../../../lib/middlewareNews/middleware"
import ProjectImgModel from '../../../../models/projectImg'
import fs from "fs"

const handler = nextConnect();
handler.use(middleware);


handler.post(async(req, res) =>{
    const {
        title,
        markdown,
        author,
        tags,
        twitterLink,
        discordLink,
        
    } = req.body
   
    const {displayImage,coverImage} = req.files
    //Validate all data is here
    try{
        if(!title || title==""||!displayImage||!coverImage||!markdown||markdown==""||!author||author == ""){
            res.statusCode(HttpStatus.BAD_REQUEST).json({success:false,error:"Invalid Request Data"})
        }
    }catch(e){
        console.log(e)
        res.statusCode(HttpStatus.BAD_REQUEST).json({success:false,error:"Invalid Request Data"})
        return
    }
    
    // Passed validation, Upload
    await dbConnect()
    try{
        var newCoverImg = new ProjectImgModel
        newCoverImg.img.data = fs.readFileSync(coverImage.filepath)
        newCoverImg.img.contentType = 'image/jpeg';
        await newCoverImg.save();

        var newDisplayImg = new ProjectImgModel
        newDisplayImg.img.data = fs.readFileSync(displayImage.filepath)
        newDisplayImg.img.contentType = 'image/jpeg';
        await newDisplayImg.save();

        try{
            const newNewsData = new NewsModel({
                title,
                author,
                markdown,
                tags,
                twitterLink,
                discordLink,
                displayImageUrl:displayImage.filepath,
                displayImageName:displayImage.newFilename,
                displayImageId:newDisplayImg._id,
                coverImageUrl:coverImage.filepath,
                coverImageName:coverImage.newFilename,
                coverImageId:newCoverImg._id
            })
            await newNewsData.save()
            res.status(HttpStatus.ACCEPTED).json({success:true})
            console.log("success")
    
        }catch(e){
            console.log(e)
            res.status(HttpStatus.BAD_REQUEST).json({success:false,error:e.message})
        }
    }catch(e){
        console.log(e)
        res.status(HttpStatus.BAD_REQUEST).json({success:false,error:e.message})
    }
    
    
})




//Turn off default
export const config = {
    api: {
      bodyParser: false,
    },
}
export default handler;


