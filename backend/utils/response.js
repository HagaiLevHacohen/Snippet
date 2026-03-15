// utils/response.js
const sendSuccess = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const sendError = (res, error = "Something went wrong", status = 400, errors = null) => {
  const payload = { success: false, message: error };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
};

module.exports = { sendSuccess, sendError };