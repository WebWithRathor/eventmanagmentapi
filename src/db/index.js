const mongoose = require("mongoose");
const { DB_NAME } = require("../constant");

exports.connectDB = async () => {
  try {
    const result = await mongoose.connect(
      `${process.env.MongoDbUrl}${DB_NAME}`
    );
    console.log('Database connection established');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};