import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ['student', 'faculty'],
      default: 'student'
    },
    googleId: {
      type: String,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

const User = model('User', userSchema);

export default User;
