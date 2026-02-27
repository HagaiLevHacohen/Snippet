// controllers/indexController.js


const getIndex = async (req, res, next) => {
      res.json({message: "Welcome to the website. Backend initialized."});
};


module.exports = { getIndex };
