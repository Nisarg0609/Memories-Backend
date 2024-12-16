import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  message: String,
  name: String,
  email: String,
  tags: [String],
  selectedFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
  },
  comments: {
    type: [String],
  },
  ratingArray: {
    type: [Number],
    default: [],
  },
  ratingId: {
    type: [String],
    default: [],
  },
  reviews: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const PostMessage = mongoose.model("Post", postSchema);

export default PostMessage;
