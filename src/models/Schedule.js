const moongose = require('mongoose');
const { Schema } = moongose;

const ScheduleSchema = new Schema({
    user: {
        type: String
    },
    date: {
        type: Date
    },
    field11: {
        type: Boolean, default: false
    },
    field12: {
        type: Boolean, default: false
    },
    field13: {
        type: Boolean, default: false
    },
    field14: {
        type: Boolean, default: false
    },
    field15: {
        type: Boolean, default: false
    },
    field21: {
        type: Boolean, default: false
    },
    field22: {
        type: Boolean, default: false
    },field23: {
        type: Boolean, default: false
    },
    field24: {
        type: Boolean, default: false
    },
    field25: {
        type: Boolean, default: false
    },
    field31: {
        type: Boolean, default: false
    },
    field32: {
        type: Boolean, default: false
    },
    field33: {
        type: Boolean, default: false
    },
    field34: {
        type: Boolean, default: false
    },
    field35: {
        type: Boolean, default: false
    },
    field41: {
        type: Boolean, default: false
    },
    field42: {
        type: Boolean, default: false
    },
    field43: {
        type: Boolean, default: false
    },
    field44: {
        type: Boolean, default: false
    },
    field45: {
        type: Boolean, default: false
    },
    field51: {
        type: Boolean, default: false
    },
    field52: {
        type: Boolean, default: false
    },
    field53: {
        type: Boolean, default: false
    },
    field54: {
        type: Boolean, default: false
    },
    field55: {
        type: Boolean, default: false
    },
    field61: {
        type: Boolean, default: false
    },
    field62: {
        type: Boolean, default: false
    },
    field63: {
        type: Boolean, default: false
    },
    field64: {
        type: Boolean, default: false
    },
    field65: {
        type: Boolean, default: false
    },
    field71: {
        type: Boolean, default: false
    },
    field72: {
        type: Boolean, default: false
    },
    field73: {
        type: Boolean, default: false
    },
    field74: {
        type: Boolean, default: false
    },
    field75: {
        type: Boolean, default: false
    },
    field81: {
        type: Boolean, default: false
    },
    field82: {
        type: Boolean, default: false
    },
    field83: {
        type: Boolean, default: false
    },
    field84: {
        type: Boolean, default: false
    },
    field85: {
        type: Boolean, default: false
    },
    field91: {
        type: Boolean, default: false
    },
    field92: {
        type: Boolean, default: false
    },
    field93: {
        type: Boolean, default: false
    },
    field94: {
        type: Boolean, default: false
    },
    field95: {
        type: Boolean, default: false
    },fielda1: {
        type: Boolean, default: false
    },
    fielda2: {
        type: Boolean, default: false
    },
    fielda3: {
        type: Boolean, default: false
    },
    fielda4: {
        type: Boolean, default: false
    },
    fielda5: {
        type: Boolean, default: false
    },
    fieldb1: {
        type: Boolean, default: false
    },
    fieldb2: {
        type: Boolean, default: false
    },
    fieldb3: {
        type: Boolean, default: false
    },
    fieldb4: {
        type: Boolean, default: false
    },
    fieldb5: {
        type: Boolean, default: false
    },
    fieldc1: {
        type: Boolean, default: false
    },
    fieldc2: {
        type: Boolean, default: false
    },
    fieldc3: {
        type: Boolean, default: false
    },
    fieldc4: {
        type: Boolean, default: false
    },
    fieldc5: {
        type: Boolean, default: false
    },
    fieldd1: {
        type: Boolean, default: false
    },
    fieldd2: {
        type: Boolean, default: false
    },
    fieldd3: {
        type: Boolean, default: false
    },
    fieldd4: {
        type: Boolean, default: false
    },
    fieldd5: {
        type: Boolean, default: false
    }
});