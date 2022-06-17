const moongose = require('mongoose');
const { Schema } = moongose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema ({
    admin: {type: Boolean, default: false},
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    second_last_name: {type: String, required: false},
    username: {type: String, require: true},
    password: {type: String, require: true},
    phone: {type: String, required: false},
    email_i:{type: String, required: false},
    email_personal:{type: String, required: false},
    email_p:{type: String, required: false},
    favorite_email: {
        type: String, required: false
    },
    address:{type: String, required: false},
    admission:{type: String, required: false },
    curp:{type: String, required: false},
    rfc:{type: String, required: false},
    profile:{type: String, required: false},
    study_degree:{type: String, required: false},
    date: {type: Date, default: Date.now },
    imageURL: {type: String},
    public_id: {type: String}
});

UserSchema.methods.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = moongose.model('User', UserSchema);