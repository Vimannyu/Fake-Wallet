import mongoose from 'mongoose';

const {Schema} = mongoose;

const postSchema = new Schema(
  {
    sender: {
      type: String,
      required: true
    },
    recipient: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required : true
    },
    initiator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', postSchema);
