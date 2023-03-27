
import HttpStatus from 'http-status-codes'
import dbConnect from '../../../../lib/dbConnect'
import ImageModel from "../../../../models/projectImg"
global.Buffer = global.Buffer || require('buffer').Buffer;
export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getProjectImage(req, res);
        }
        
    }
}

const arrayBufferToBase64 = (buffer) =>{
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return global.btoa(binary);
};

const getProjectImage = async (req,res)=>{
    const projectImageId = req.query.id
    try{
        await dbConnect()
        const foundProjectImage = await ImageModel.findOne({_id:projectImageId})
        if(foundProjectImage){
            var img = Buffer.from(foundProjectImage.img.data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
              });
              res.end(img); 
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({success:false})
        }
    }catch(e){
        res.status(HttpStatus.CONFLICT).json({success:false})

    }
    
}

