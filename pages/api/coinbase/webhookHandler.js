import HttpStatus from 'http-status-codes'
import dbConnect from '../../../lib/dbConnect'
import {Webhook } from "coinbase-commerce-node"
import ProjectModel from "../../../models/project"
// Client.init(`bdf08022-b82a-4815-aa67-f0acce2ca61a`)


export default async function handler(req, res) {
    return handleWebhook(req,res)

}


const handleWebhook = async(req,res)=>{
    
    const rawBody = JSON.stringify(req.body)
    const signature = req.headers['x-cc-webhook-signature']
    const webhookSecret = "38d27b28-8b42-402b-9a30-43367f3585cd"
    console.log("WEBHOOK HANDLING")       
    console.log("38d27b28-8b42-402b-9a30-43367f3585cd")
    try{

        const event = Webhook.verifyEventBody(rawBody,signature,webhookSecret)
        // if(event.type === 'charge:confirmed'){
        if(event.type === 'charge:confirmed'){ 
            await dbConnect()
            let {projectId} = event.data.metadata
            if(projectId){
                let updatedProject = await ProjectModel.findOneAndUpdate({_id:projectId},{paymentComplete:true})
            }
        }
        res.json({success:true,eventId:event.id})  

    }catch(e){
        console.log(e)
        res.json({success:false,error:e})  
    }
     
}