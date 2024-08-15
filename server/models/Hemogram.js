const mongoose = require('mongoose');

const HemogramSchema = new mongoose.Schema({
    client_name: { type: String, required: true },
    hemoglobin: { type: Number, required: true },
    rbc_count: { type: Number, required: true },
    wbc_count: { type: Number, required: true },
    platelet_count: { type: Number, required: true },
    polymorphs: { type: Number, required: true },
    lymphocytes: { type: Number, required: true },
    eosinophils: { type: Number, required: true },
    monocytes: { type: Number, required: true },
    basophils: { type: Number, required: true },
    pcv: { type: Number, required: true },
    mcv: { type: Number, required: true },
    mch: { type: Number, required: true },
    mchc: { type: Number, required: true },
    rdw: { type: Number, required: true },
    rbcs: { type: String, required: true },
    wbcs: { type: String, required: true },
    platelet_option: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const HemogramModel = mongoose.model('Hemogram', HemogramSchema);
module.exports = HemogramModel;
