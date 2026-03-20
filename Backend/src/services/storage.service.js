const ImageKit = require("@imagekit/nodejs");
const config = require('../config/config');

const imagekit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY 
});

async function uploadFile(buffer) {
  try {
    const response = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: "image.jpg",
      folder: "/online-bookstore",
    });

    return response;

  } catch (error) {
    console.error("Error uploading file:", error);
  }
}


module.exports = uploadFile;