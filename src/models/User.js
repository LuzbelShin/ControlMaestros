const moongose = require('mongoose');
const { Schema } = moongose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    admin: { 
        type: Boolean, 
        default: false 
    },
    name: { 
        type: String, 
        required: true 
    },
    last_name: { 
        type: String,
        required: true 
    },
    second_last_name: { 
        type: String, 
        required: false 
    },
    username: { 
        type: String, 
        require: true,
        unique: true
    },
    password: { 
        type: String, 
        require: false 
    },
    phone: { 
        type: String, 
        required: false 
    },
    email_i: { 
        type: String, 
        required: false 
    },
    email_personal: { 
        type: String, 
        required: false 
    },
    email_p: { 
        type: String, 
        required: false 
    },
    favorite_email: {
        type: String, 
        required: false
    },
    address: { 
        type: String, 
        required: false 
    },
    admission: { 
        type: String, 
        required: false 
    },
    curp: { 
        type: String, 
        required: false 
    },
    rfc: { 
        type: String, 
        required: false 
    },
    profile: { 
        type: String, 
        required: false 
    },
    study_degree: { 
        type: String, 
        required: false 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    imageURL: { 
        type: String,
        default: 'https://res.cloudinary.com/dpar6bmfd/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max/v1654021505/149071_ddfsfq.png'
    },
    public_id: { 
        type: String 
    },
    google: {
        id: { 
            type: String, 
            required: false 
        },
        token: { 
            type: String, 
            required: false 
        },
        email: { 
            type: String, 
            required: false 
        },
        name: { 
            type: String, 
            required: false 
        }
    }
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = moongose.model('User', UserSchema);