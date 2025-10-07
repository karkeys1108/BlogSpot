import { Schema, model } from 'mongoose';

const certificateSchema = new Schema(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: null
    },
    issuedOn: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

certificateSchema.virtual('id').get(function () {
  return this._id.toString();
});

certificateSchema.virtual('enrollmentId').get(function () {
  if (!this.enrollment) return undefined;
  if (typeof this.enrollment === 'string') return this.enrollment;
  if (this.enrollment._id) return this.enrollment._id.toString();
  if (this.enrollment.toString) return this.enrollment.toString();
  return undefined;
});

certificateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    ret.enrollmentId = ret.enrollment?.toString();
    delete ret._id;
    return ret;
  }
});

const Certificate = model('Certificate', certificateSchema);

export default Certificate;
