// models/TestList.js
const mongoose = require('mongoose');

const testListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true, default: 0 },
    status: { type: Boolean, required: true, default: true },
    delete_flag: { type: Boolean, required: true, default: false },
    date_created: { type: Date, default: Date.now },
    date_updated: { type: Date, default: Date.now }
});

const TestList = mongoose.model('TestList', testListSchema);

module.exports = TestList;
