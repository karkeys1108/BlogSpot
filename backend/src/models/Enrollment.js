import { Schema, model } from 'mongoose';

const toStringId = (value) => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (value._id) return value._id.toString();
  if (value.toString) return value.toString();
  return undefined;
};

const enrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['enrolled', 'in-progress', 'completed'],
      default: 'enrolled'
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

enrollmentSchema.virtual('id').get(function () {
  return this._id.toString();
});

enrollmentSchema.virtual('userId').get(function () {
  return toStringId(this.user);
});

enrollmentSchema.virtual('courseId').get(function () {
  return toStringId(this.course);
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

enrollmentSchema.virtual('certificate', {
  ref: 'Certificate',
  localField: '_id',
  foreignField: 'enrollment',
  justOne: true
});

enrollmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    ret.userId = ret.user?.toString();
    ret.courseId = ret.course?.toString();
    delete ret._id;
    return ret;
  }
});

const Enrollment = model('Enrollment', enrollmentSchema);

export default Enrollment;
