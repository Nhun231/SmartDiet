const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waterSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("Water", waterSchema);
