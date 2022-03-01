import mongoose, { model } from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true

  },
  bankBalance : {
    type: Number,
    default: 100
  },
  transactionID: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ]
});

export default model('User', userSchema);
