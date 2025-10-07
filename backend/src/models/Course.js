import { Schema, model } from 'mongoose';

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    provider: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    level: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    thumbnail: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

courseSchema.virtual('id').get(function () {
  return this._id.toString();
});

courseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

const Course = model('Course', courseSchema);

export default Course;
