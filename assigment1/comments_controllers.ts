import Comments from "../models/comments_model";

// Add a new comment
const addNewComment = async (req, res) => {
  try {
    const comment = await Comments.create(req.body);
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comments.find();
    res.send(comments);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get comments by post ID
const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comments.find({ postId });
    res.send(comments);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedComment = await Comments.findByIdAndUpdate(id, req.body, { new: true });
    res.send(updatedComment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    await Comments.findByIdAndDelete(id);
    res.status(200).send({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export {
  addNewComment,
  getAllComments,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
