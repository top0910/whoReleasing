import mongoose from 'mongoose'
import moment from "moment"
const Schema = mongoose.Schema;

const Project = new Schema({
  email:{
    type:String,
    required:true
  },
  dateCreated:{
    type:Date,
    default:moment()
  }
})

module.exports = mongoose.models.Email || mongoose.model("Email", Project);
