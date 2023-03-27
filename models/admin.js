import mongoose from 'mongoose'
import moment from "moment"
const Schema = mongoose.Schema;

const Admin = new Schema({
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
})

module.exports = mongoose.models.Admin || mongoose.model("Admin", Admin);
