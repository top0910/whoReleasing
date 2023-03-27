import mongoose from 'mongoose'
const Schema = mongoose.Schema;

var ProjectImg = new Schema({
  img: { 
    data: Buffer, 
    contentType: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.ProjectImg || mongoose.model("ProjectImg", ProjectImg);
