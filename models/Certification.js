const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certificationSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    formation: { type: Schema.Types.ObjectId, ref: 'Formation', required: true },
    dateIssued: { type: Date, default: Date.now },
    certifiedBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true }
});

module.exports = mongoose.model('Certification', certificationSchema);
