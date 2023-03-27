
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
    let {startDate,maxAmount} = params
    
   
    try{
        await dbConnect()
        //Get all dates from startdate to amount of extra dates
        let allPossibleDates = []
        let allProjectDates = []
        let currentDateShowingIndex = Number(maxAmount)

        try{
            //Get all possible Dates
            allPossibleDates= await ProjectModel.distinct("publicsale.date",{
                "publicsale.date":{$gte: moment(startDate).startOf("day").toISOString()},
                approved:true
            })
            console.log(allPossibleDates)
            for(let i=0;i<currentDateShowingIndex;i++){
                try{
                    if(!allPossibleDates[i]) break
                    console.log("\n",allPossibleDates[i])
                    let dayProjects =  await ProjectModel.find({
                        "publicsale.date":{
                            $gte: allPossibleDates[i],
                            $lte: moment(allPossibleDates[i]).endOf('day').toISOString()
                        },
                        approved:true
                    },{description:0})
                    allProjectDates.push({date:allPossibleDates[i],data:dayProjects})
                }catch(e){
                    console.log(e)
                }  
            }

        }catch(e){
            console.log(e)
        }
        currentDateShowingIndex-=1
        res.status(HttpStatus.ACCEPTED).json({success:true,allProjectDates,allPossibleDates,currentDateShowingIndex})

    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
    
}