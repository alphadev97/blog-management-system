const Post = require("../models/Post");

// GET post statistics using MongoDB aggregation
const getPostStats = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                totalPosts: { $sum: 1 },
                publishedPosts: {
                  $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
                },
                draftPosts: {
                  $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
                },
              },
            },
          ],
          topAuthors: [
            {
              $group: {
                _id: "$author",
                postCount: { $sum: 1 },
              },
            },
            { $sort: { postCount: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "authorInfo",
              },
            },
            {
              $project: {
                _id: 1,
                postCount: 1,
                name: { $arrayElemAt: ["$authorInfo.name", 0] },
              },
            },
          ],
        },
      },
    ]);

    const result = {
      totalPosts: stats[0].totalStats[0]?.totalPosts || 0,
      publishedPosts: stats[0].totalStats[0]?.publishedPosts || 0,
      draftPosts: stats[0].totalStats[0]?.draftPosts || 0,
      topAuthors: stats[0].topAuthors,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPostStats };
