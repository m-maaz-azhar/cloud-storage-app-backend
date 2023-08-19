const { uploadFile, getAllFiles, removeFile, getFile, emailFileLink, addToFavourites, removeFromFavourites, getFavourites } = require("../controllers/file.controller");
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = function (app) {
    app.route("/file/upload").post(upload.single("file"), uploadFile);
    app.route("/file/get").get(getAllFiles);
    app.route("/file/get/:id").get(getFile);
    app.route("/file/remove").delete(removeFile);
    app.route("/file/mail").post(emailFileLink);
    app.route("/file/favourite").post(addToFavourites);
    app.route("/file/unfavourite").post(removeFromFavourites);
    app.route("/file/get/favourites").get(getFavourites);
}