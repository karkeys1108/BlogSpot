import { Schema, model } from 'mongoose';

const classroomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    recommendations: [
      {
        title: {
          type: String,
          required: true,
          trim: true
        },
        url: {
          type: String,
          required: true,
          trim: true
        },
        notes: {
          type: String,
          default: ''
        },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

classroomSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    if (Array.isArray(ret.recommendations)) {
      ret.recommendations = ret.recommendations.map((recommendation) => ({
        id: recommendation._id?.toString() || recommendation.id,
        title: recommendation.title,
        url: recommendation.url,
        notes: recommendation.notes,
        createdAt: recommendation.createdAt,
        createdBy: recommendation.createdBy
      }));
    }
    delete ret._id;
    return ret;
  }
});

const Classroom = model('Classroom', classroomSchema);

export default Classroom;
