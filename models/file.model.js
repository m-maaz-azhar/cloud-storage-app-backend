const mongoose = require('mongoose');

const FileSchema = mongoose.Schema({
    name: String,
    url: String,
    size: Number,
    type: String,
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);