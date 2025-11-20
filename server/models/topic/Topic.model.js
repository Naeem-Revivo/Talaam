const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    parentSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Parent subject is required'],
    },
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Topic', topicSchema);

