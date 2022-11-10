const moongose = require('mongoose');
const { Schema } = moongose;

const ScheduleSchema = new Schema({
    user: {
        type: String
    },
    date: {
        type: Date
    },
    notes: {
        type: String
    },
    temporal: {
        type: Boolean, default: false,
    },
    final: {
        type: Boolean, default: false
    },
    period: {
        type: String
    },
    active: {
        type: Boolean, default: true,
    },
    field11: {
        type: Boolean, default: true,
    },
    field12: {
        type: Boolean, default: true,
    },
    field13: {
        type: Boolean, default: true,
    },
    field14: {
        type: Boolean, default: true,
    },
    field15: {
        type: Boolean, default: true,
    },
    field21: {
        type: Boolean, default: true,
    },
    field22: {
        type: Boolean, default: true,
    }, field23: {
        type: Boolean, default: true,
    },
    field24: {
        type: Boolean, default: true,
    },
    field25: {
        type: Boolean, default: true,
    },
    field31: {
        type: Boolean, default: true,
    },
    field32: {
        type: Boolean, default: true,
    },
    field33: {
        type: Boolean, default: true,
    },
    field34: {
        type: Boolean, default: true,
    },
    field35: {
        type: Boolean, default: true,
    },
    field41: {
        type: Boolean, default: true,
    },
    field42: {
        type: Boolean, default: true,
    },
    field43: {
        type: Boolean, default: true,
    },
    field44: {
        type: Boolean, default: true,
    },
    field45: {
        type: Boolean, default: true,
    },
    field51: {
        type: Boolean, default: true,
    },
    field52: {
        type: Boolean, default: true,
    },
    field53: {
        type: Boolean, default: true,
    },
    field54: {
        type: Boolean, default: true,
    },
    field55: {
        type: Boolean, default: true,
    },
    field61: {
        type: Boolean, default: true,
    },
    field62: {
        type: Boolean, default: true,
    },
    field63: {
        type: Boolean, default: true,
    },
    field64: {
        type: Boolean, default: true,
    },
    field65: {
        type: Boolean, default: true,
    },
    field71: {
        type: Boolean, default: true,
    },
    field72: {
        type: Boolean, default: true,
    },
    field73: {
        type: Boolean, default: true,
    },
    field74: {
        type: Boolean, default: true,
    },
    field75: {
        type: Boolean, default: true,
    },
    field81: {
        type: Boolean, default: true,
    },
    field82: {
        type: Boolean, default: true,
    },
    field83: {
        type: Boolean, default: true,
    },
    field84: {
        type: Boolean, default: true,
    },
    field85: {
        type: Boolean, default: true,
    },
    field91: {
        type: Boolean, default: true,
    },
    field92: {
        type: Boolean, default: true,
    },
    field93: {
        type: Boolean, default: true,
    },
    field94: {
        type: Boolean, default: true,
    },
    field95: {
        type: Boolean, default: true,
    }, fielda1: {
        type: Boolean, default: true,
    },
    fielda2: {
        type: Boolean, default: true,
    },
    fielda3: {
        type: Boolean, default: true,
    },
    fielda4: {
        type: Boolean, default: true,
    },
    fielda5: {
        type: Boolean, default: true,
    },
    fieldb1: {
        type: Boolean, default: true,
    },
    fieldb2: {
        type: Boolean, default: true,
    },
    fieldb3: {
        type: Boolean, default: true,
    },
    fieldb4: {
        type: Boolean, default: true,
    },
    fieldb5: {
        type: Boolean, default: true,
    },
    fieldc1: {
        type: Boolean, default: true,
    },
    fieldc2: {
        type: Boolean, default: true,
    },
    fieldc3: {
        type: Boolean, default: true,
    },
    fieldc4: {
        type: Boolean, default: true,
    },
    fieldc5: {
        type: Boolean, default: true,
    },
    fieldd1: {
        type: Boolean, default: true,
    },
    fieldd2: {
        type: Boolean, default: true,
    },
    fieldd3: {
        type: Boolean, default: true,
    },
    fieldd4: {
        type: Boolean, default: true,
    },
    fieldd5: {
        type: Boolean, default: true,
    },
    statusField11: {
        type: String, default: 'Available',
    },
    statusField12: {
        type: String, default: "Available",
    },
    statusField13: {
        type: String, default: "Available",
    },
    statusField14: {
        type: String, default: "Available",
    },
    statusField15: {
        type: String, default: "Available",
    },
    statusField21: {
        type: String, default: "Available",
    },
    statusField22: {
        type: String, default: "Available",
    }, statusField23: {
        type: String, default: "Available",
    },
    statusField24: {
        type: String, default: "Available",
    },
    statusField25: {
        type: String, default: "Available",
    },
    statusField31: {
        type: String, default: "Available",
    },
    statusField32: {
        type: String, default: "Available",
    },
    statusField33: {
        type: String, default: "Available",
    },
    statusField34: {
        type: String, default: "Available",
    },
    statusField35: {
        type: String, default: "Available",
    },
    statusField41: {
        type: String, default: "Available",
    },
    statusField42: {
        type: String, default: "Available",
    },
    statusField43: {
        type: String, default: "Available",
    },
    statusField44: {
        type: String, default: "Available",
    },
    statusField45: {
        type: String, default: "Available",
    },
    statusField51: {
        type: String, default: "Available",
    },
    statusField52: {
        type: String, default: "Available",
    },
    statusField53: {
        type: String, default: "Available",
    },
    statusField54: {
        type: String, default: "Available",
    },
    statusField55: {
        type: String, default: "Available",
    },
    statusField61: {
        type: String, default: "Available",
    },
    statusField62: {
        type: String, default: "Available",
    },
    statusField63: {
        type: String, default: "Available",
    },
    statusField64: {
        type: String, default: "Available",
    },
    statusField65: {
        type: String, default: "Available",
    },
    statusField71: {
        type: String, default: "Available",
    },
    statusField72: {
        type: String, default: "Available",
    },
    statusField73: {
        type: String, default: "Available",
    },
    statusField74: {
        type: String, default: "Available",
    },
    statusField75: {
        type: String, default: "Available",
    },
    statusField81: {
        type: String, default: "Available",
    },
    statusField82: {
        type: String, default: "Available",
    },
    statusField83: {
        type: String, default: "Available",
    },
    statusField84: {
        type: String, default: "Available",
    },
    statusField85: {
        type: String, default: "Available",
    },
    statusField91: {
        type: String, default: "Available",
    },
    statusField92: {
        type: String, default: "Available",
    },
    statusField93: {
        type: String, default: "Available",
    },
    statusField94: {
        type: String, default: "Available",
    },
    statusField95: {
        type: String, default: "Available",
    }, statusFielda1: {
        type: String, default: "Available",
    },
    statusFielda2: {
        type: String, default: "Available",
    },
    statusFielda3: {
        type: String, default: "Available",
    },
    statusFielda4: {
        type: String, default: "Available",
    },
    statusFielda5: {
        type: String, default: "Available",
    },
    statusFieldb1: {
        type: String, default: "Available",
    },
    statusFieldb2: {
        type: String, default: "Available",
    },
    statusFieldb3: {
        type: String, default: "Available",
    },
    statusFieldb4: {
        type: String, default: "Available",
    },
    statusFieldb5: {
        type: String, default: "Available",
    },
    statusFieldc1: {
        type: String, default: "Available",
    },
    statusFieldc2: {
        type: String, default: "Available",
    },
    statusFieldc3: {
        type: String, default: "Available",
    },
    statusFieldc4: {
        type: String, default: "Available",
    },
    statusFieldc5: {
        type: String, default: "Available",
    },
    statusFieldd1: {
        type: String, default: "Available",
    },
    statusFieldd2: {
        type: String, default: "Available",
    },
    statusFieldd3: {
        type: String, default: "Available",
    },
    statusFieldd4: {
        type: String, default: "Available",
    },
    statusFieldd5: {
        type: String, default: "Available",
    }
});

module.exports = moongose.model('Schedule', ScheduleSchema);