const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        require:true
    },
    //here no need to define the username and password as passport-local-mongoose will automatically define it for ous!!!

});

userSchema.plugin(passportLocalMongoose);//this plugin automatically gives oes above mentioned things

module.exports = mongoose.model("User",userSchema);