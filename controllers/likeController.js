exports.dummyLink = (req, res) => {
    res.send("This is dummy page.")
}

const Post = require("../models/postModal");
const Like = require("../models/likeModal");

exports.likePost = async (req, res) => {
    try{
        const{post, user} = req.body;

        const like = new Like({
            post, user
        })

        const savedLike = await like.save();

        const updatedPost = await Post.findByIdAndUpdate(post, {$push: {likes: savedLike._id}}, {new: true})
                            .populate("likes")
                            .exec();
        res.status(200).json({
            post: updatedPost,
        })
    }
    catch(error){
        return res.status(500).json({
            error: "error while post like",
        })
    }
}

exports.unlikePost = async (req, res) => {
    try{
        const{post, like} = req.body;

        const deletedLike = await Like.findOneAndDelete({post: post, _id: like});

        const updatedPost = await Post.findByIdAndUpdate(post, {$pull: {likes: deletedLike._id}}, {new: true})
                            .populate("likes")
                            .exec();
        res.status(200).json({
            post: updatedPost,
        })
    }
    catch(error){
        return res.status(500).json({
            error: "error while post unlike",
        })
    }
}