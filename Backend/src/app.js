const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

/* Routes */
const authRoutes = require('./routes/auth.routes');
const addressRoutes = require('./routes/address.routes');

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

/* Use Routes */
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);


/* const upload = multer({ storage: multer.memoryStorage() }); */

/* app.post("/create-post", upload.single("image"), async (req, res) => {
    console.log(req.file); 

    const result = await uploadFile(req.file.buffer);

    console.log(result)

    res.json({ message: 'File uploaded successfully' });
});
 */

module.exports = app;