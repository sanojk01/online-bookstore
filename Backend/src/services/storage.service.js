const ImageKit = require("@imagekit/nodejs");
const config = require('../config/config');
const {v4: uuidv4} = require('uuid');

const imagekit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY 
});

async function uploadFile(buffer) {
  try {
    const response = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: `${uuidv4()}.jpg`,
      folder: "/online-bookstore",
    });

    return {
      url: response.url,
      thumbnailUrl: response.thumbnailUrl || response.url,
      fileId: response.fileId,
    };

  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

 // Delete file from ImageKit
async function deleteFromImageKit(fileId) {
    try {
      await imagekit.files.delete(fileId);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
}



module.exports = {
  uploadFile,
  deleteFromImageKit
};