
import nextConnect from 'next-connect';
import HttpStatus from 'http-status-codes'
const uuidv4 = require("uuid").v4
import dbConnect from '../../../../lib/dbConnect'
import ProjectModel from '../../../../models/project'
import ProjectImgModel from '../../../../models/projectImg'
import middleware from "../../../../lib/middleware/middleware"
import fs from "fs"
import {servicePrice} from "../../../../src/config"
import moment from 'moment';

const handler = nextConnect();
handler.use(middleware);

const calculateFinalPrice = (services)=>{
    let price = 0

    // Is featured
    if(services.featureRequested == "true"){
        let startDate = moment(services.featureRequestedStartDate)
        let endDate = moment(services.featureRequestedEndDate)
        let diff = moment.duration(endDate.diff(startDate)).asDays();
        price+= (diff*servicePrice.featuredPerDay)
    }

    // Twitter Giveway
    if(services.twitterShoutout!=="none"){
      price+= servicePrice.twitterGiveawayPost
    }

    
    // Discord Giveway
    if(services.discordShoutout!=="none"){
      price+= servicePrice.discordGiveawayPost
    }

    // twitter cover
    if(services.frontPageRequested == "true"){
        let startDate = moment(services.frontPageRequestedStartDate)
        let endDate = moment(services.frontPageRequestedEndDate)
        let diff = moment.duration(endDate.diff(startDate)).asDays();
        price+= (diff*servicePrice.twitterCoverPhotoPerDay)
    }
    return price.toFixed(1)
  }

handler.post(async(req, res) =>{
    const {
        name,
        // discordUsername,
        collectionCount,
        blockchainType,
        saleStatusType,
        description,
        presale,
        publicsale,
        socialInformation,
        services,
        hasPresale
    } = req.body

    const {image} = req.files
 
    // console.log(req.body)
    //Validate all data is here
    try{
        if( name=="" ||  Number(collectionCount)<1 || blockchainType=="" || saleStatusType=="" || description =="" || hasPresale == ""){
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
        if(!image || !socialInformation || socialInformation.email ==""){
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

        if(description.length>300){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
    }catch(e){
        console.log(e)
        res.statusCode(HttpStatus.BAD_REQUEST).json({success:false})
        return
    }
    
    //make sure 0 values are in
    if(presale.price == "")
        presale.price = 0
    if(socialInformation.discordFollowerCount == "")
        socialInformation.discordFollowerCount = 0
    if(socialInformation.twitterFollowerCount == "")
        socialInformation.twitterFollowerCount = 0

    // Passed validation, Upload
    let finalPrice
    try{
        finalPrice =  calculateFinalPrice(services)
        if(Number.isNaN(finalPrice)){
            res.statusCode(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
    }catch{
        res.statusCode(HttpStatus.BAD_REQUEST).json({success:false})
        return
    }
   
    await dbConnect()

    //UPLOAD IMAGE
    try{
        var newProjectImg = new ProjectImgModel
        newProjectImg.img.data = fs.readFileSync(image.filepath)
        newProjectImg.img.contentType = 'image/jpeg';
        await newProjectImg.save();
        try{
            const newProjectData = new ProjectModel({
                id:uuidv4(),
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
                imageUrl:image.filepath,
                imageName:image.newFilename,
                imageId:newProjectImg._id,
                paymentComplete:finalPrice == 0?true:false
            })
            await newProjectData.save()
            res.status(HttpStatus.ACCEPTED).json({success:true,data:newProjectData,finalPrice:finalPrice})
            console.log("success")
    
        }catch(e){
            console.log(e)
            console.log("failed")
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
        }
    }catch(e){
        console.log(`Error savingImage to DB`)
        console.log(e)
        res.status(HttpStatus.BAD_REQUEST).json({success:false})
    }
})




//Turn off default
export const config = {
    api: {
      bodyParser: false,
    },
}
export default handler;





/*
old validator
try{
        if( name=="" || discordUsername=="" || Number(collectionCount)<1 || blockchainType=="" || saleStatusType=="" || description =="" ){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }

        if(!presale || Number(presale.price) <0 || presale.date =="" || presale.time=="" || !publicsale || Number(publicsale.price) <0 || publicsale.date =="" ||publicsale.time=="" ){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
        if(!image || !socialInformation ||socialInformation.twitterUrl =="" ||socialInformation.discordUrl =="" || socialInformation.twitterFollowerCount =="" || socialInformation.discordFollowerCount ==""||socialInformation.email ==""||socialInformation.website ==""){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
        if(!services || services.featuredRequested == "" || services.twitterShoutout == ""||services.discordShoutout == ""||services.frontPageRequested == ""||services.growthInterest==""||services.discordContact==""){
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

        if(description.length>300){
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
            return
        }
    }catch(e){
        console.log(e)
        res.statusCode(HttpStatus.BAD_REQUEST).json({success:false})
        return
    }
    


*/