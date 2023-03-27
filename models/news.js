import mongoose from 'mongoose'
import moment from "moment"
const Schema = mongoose.Schema;

const News = new Schema({
  title:{
    type:String,
    required:true
  },
  markdown:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  tags:{
    type:Array,
    default:[]
  },
  twitterLink:{
    type:String,
    default:""
  },
  discordLink:{
    type:String,
    default:""
  },
  coverImageUrl:{
    type:String,
    default:""
  },
  coverImageName:{
    type:String,
    required:true
  },
  coverImageId:{
    type:String,
    required:true
  },
  displayImageUrl:{
    type:String,
    default:""
  },
  displayImageName:{
    type:String,
    required:true
  },
  displayImageId:{
    type:String,
    required:true
  },
  dateCreated:{
    type:Date,
    default:moment()
  }
})

module.exports = mongoose.models.News || mongoose.model("News", News);
