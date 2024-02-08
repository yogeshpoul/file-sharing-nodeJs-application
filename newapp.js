const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
// Serve static files from the specified directory
app.use('/files', express.static('C:/')); // Adjust the directory as needed

app.get('/:path(*)', async (req, res) => {
    const basePath = 'C:/'; // Adjust this to the base path you want to start from
    const requestedPath = req.params.path || '';

    const absolutePath = path.join(basePath, requestedPath);

    try {
        const stats = await fs.stat(absolutePath);

        if (stats.isDirectory()) {
            const files = await fs.readdir(absolutePath);
            res.json({ files });
        } else {
            // If it's a file, serve it
            const extname = path.extname(absolutePath);
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm', '.mp3', '.wav', '.flac', '.aac', '.ogg', '.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.csv', '.zip', '.rar', '.tar', '.7z', '.html', '.css', '.js', '.py', '.java', '.ttf', '.otf', '.woff', '.woff2', '.md', '.ppt', '.key']; // Add more extensions as needed

            if (allowedExtensions.includes(extname)) {
                // Serve supported file types
                res.sendFile(absolutePath);
            } else {
                // Unsupported file type
                res.status(400).json({ error: 'Unsupported file type' });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}/`);
});
