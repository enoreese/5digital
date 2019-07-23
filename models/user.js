const mongoose = require("mongoose");
// const deepPopulate = require('mongoose-deep-populate')(mongoose)

const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    email:{type: String, unique: true, lowercase: true},
    fullname: String,
    lastname: String,
    address: String,
    shippingaddress: String,
    isVerified: {type: Boolean, default: false},
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    phonenumber: {type: Number, unique: true, maxlength: [11, 'Phonenumber must not be more 11 numbers'],},
    photo: String,
    role: Number,
    projects: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Project"
    }],
    // file:[{
    //     type: mongoose.Schema.Types.ObjectId, ref: "File"
    // }],
    // designs:[{
    //     type: mongoose.Schema.Types.ObjectId, ref: "Design"
    // }],
    // fabrics:[{
    //     type: mongoose.Schema.Types.ObjectId, ref: "Fabric"
    // }],
    // accessories:[{
    //     type: mongoose.Schema.Types.ObjectId, ref: "Accessories"
    // }],
    // cart:[{
    //     type: mongoose.Schema.Types.ObjectId, ref: "Design"
    // }],
    // sews:[{
    //     type: mongoose.Schema.Types.ObjectId, ref: "Sew"
    // }]
});

UserSchema.pre("save", function (next) {
    var user = this;
    if(!user.isModified("password")) return next();
    if(user.password){
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next();
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if(err) return next();
                user.password = hash;
                next(err);
            });
        });
    }
});

//Schema to associate user image to email
UserSchema.methods.gravatar = function(size) {
    if(!size) size = 200;
    if(!this.email) return "https://gravatar.com/avatar/?s=" + size + "&d=retro";
    var md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};

//Schema to comparing user inputed Password and the password in the DB
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
//Populates schema to any level
// UserSchema.plugin(deepPopulate)
module.exports = mongoose.model("User", UserSchema);