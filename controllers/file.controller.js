const multer = require("multer");

const File = require("../models/file.model");
const { bucket } = require("../services/firebase");
const sendMail = require("../services/email");

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }

        const file = req.file;
        const fileName = file.originalname;
        const fileBuffer = file.buffer;

        let checkFile = File.findOne({ name: fileName })
        if (checkFile.name) {
            res.status(400).send('File with this name already exists.');
            return;
        }

        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream();

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('File upload error.');
        });

        blobStream.on('finish', async () => {
            let fileUrl = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            });

            fileUrl = fileUrl[0];

            const newFile = new File({
                name: fileName,
                url: fileUrl,
                size: file.size,
                type: file.mimetype,
                date: Date.now(),
                user: req.query.user_id
            });

            await newFile.save();

            res.status(200).send({ ok: true });
        });

        blobStream.end(fileBuffer);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.getAllFiles = async (req, res) => {
    try {
        let user_id = req.query.user_id;
        let files = await File.find({ user: user_id });
        res.status(200).json({ files, ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.getFile = async (req, res) => {
    try {
        let file_id = req.params.id;
        let file = await File.findById(file_id);
        res.status(200).json({ file, ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.removeFile = async (req, res) => {
    try {
        let file_id = req.query.file_id;
        let file = await File.findById(file_id);
        await bucket.file(file.name).delete();
        await File.findByIdAndDelete(file_id);
        res.status(200).json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.emailFileLink = async (req, res) => {
    try {
        const mailOptions = {
            from: '',
            to: req.body.email,
            subject: `${req.body.file.name} - CSA`,
            html: `<p><a href="${req.body.file.url}">Download File</a></p>`
        };

        await sendMail(mailOptions)
        res.status(200).json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.addToFavourites = async (req, res) => {
    try {

        let file_id = req.query.file_id;

        await File.findByIdAndUpdate(file_id, { favourite: true });

        res.status(200).json({ ok: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.removeFromFavourites = async (req, res) => {
    try {
        let file_id = req.query.file_id;

        await File.findByIdAndUpdate(file_id, { favourite: false });

        res.status(200).json({ ok: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}

exports.getFavourites = async (req, res) => {
    try {
        let user_id = req.query.user_id;

        let files = await File.find({ user: user_id, favourite: true });

        res.status(200).json({ files, ok: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, ok: false });
    }
}