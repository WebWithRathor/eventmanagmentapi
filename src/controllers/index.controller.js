const { catchAsyncError } = require("../middlewares/CatchAsyncError");
const attendeModel = require("../models/attende.model");
const ErrorHandler = require("../utils/ErrorHandler");
const { SendToken } = require("../utils/SendToken");

exports.attendesignup = catchAsyncError(async (req, res, next) => {
  const attendee = await new attendeModel(req.body).save();
  if (attendee.role === "attendee") attendee.isComplete = true;
  await attendee.save();
  SendToken(attendee, 201, res);
});

exports.attendesignin = catchAsyncError(async (req, res, next) => {
  const attendee = await attendeModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!attendee) {
    return next(
      new ErrorHandler("The attendee with this email doesn't exsists", 401),
    );
  }
  const isMatch = await attendee.comparePassword(req.body.password);
  if (!isMatch) {
    return next(new ErrorHandler("Wrong Password", 401));
  }
  SendToken(attendee, 200, res);
});

exports.attendesignout = catchAsyncError(async (req, res, next) => {
  const attendee = await attendeModel.findOne({ _id: req.id }).exec();
  if (!attendee) {
    return next(
      new ErrorHandler(401, "The attendee with this email doesn't exsists"),
    );
  }
  res.clearCookie("token");
  res.json({ message: "succefully signed out" });
});

exports.CurrentAttende = catchAsyncError(async (req, res, next) => {
  const attendee = await attendeModel.findById(req.id).exec();
  if (attendee.role === "creator" && !attendee.isComplete) {
    return next(
      new ErrorHandler(401, "Please complete your profile to continue"),
    );
  }
  res.json(attendee);
});
