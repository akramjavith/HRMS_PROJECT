const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const { exec } = require('child_process');

const uploadDir = path.join(__dirname, '../../images');

// Multer configuration for file uploads
const upload = multer({ dest: uploadDir });
const progressStore = {};
// Function to handle screensaver creation
exports.createScreenSaver = catchAsyncErrors(async (req, res, next) => {
    const requestId = new Date().getTime(); // Generate a unique ID for this request
    progressStore[requestId] = 0; // Initialize progress
    upload.array('images')(req, res, async (uploadError) => {
        if (uploadError) {
            return next(new ErrorHandler("File upload error", 500));
        }

        try {
            const images = req.files;
            const interval = req.body.interval;

            if (!images || images.length === 0 || !interval) {
                return res.status(400).send('Images or interval missing');
            }

            // 1. Save images to the 'images' folder
            const imagesFolder = path.join(__dirname, 'images');
            fs.ensureDirSync(imagesFolder); // Ensure the folder exists
            progressStore[requestId] = 20; // 20% completed
            console.log("Step 1: Images folder prepared...");

            images.forEach((image, index) => {
                const imagePath = path.join(imagesFolder, `image${index + 1}${path.extname(image.originalname)}`);
                fs.renameSync(image.path, imagePath); // Move uploaded file to images folder
                console.log(`Uploaded: ${image.originalname} to ${imagePath}`);
            });



            // 2. Create a Python script dynamically using images and interval
            const pythonScript = createPythonScript(images, interval);
            console.log("Step 2: Python script created...");
            progressStore[requestId] = 40; // 40% completed

            const tempFolder = path.join(__dirname, 'temp');
            fs.ensureDirSync(tempFolder); // Create the directory if it doesn't exist

            // 3. Write the Python script to a file
            const pythonScriptPath = path.join(__dirname, 'temp', 'slideshow.py');
            fs.writeFileSync(pythonScriptPath, pythonScript);
            console.log("Step 3: Python script saved as slideshow.py...");
            progressStore[requestId] = 60; // 60% completed

            // 4. Use PyInstaller to create an executable
            console.log("Step 4: Starting PyInstaller to generate executable...");
            const distFolder = path.join(__dirname, 'dist');
            const buildFolder = path.join(__dirname, 'build');
            const pyInstallerPath = 'C:\\users\\ttsbs\\Local Settings\\Application Data\\Programs\\Python\\Python310-32\\Scripts\\pyinstaller.exe'
            const pyInstallerCommand = `wine cmd /c "${pyInstallerPath}" --onefile --distpath "${distFolder}" --workpath "${buildFolder}" --add-data "${imagesFolder}:images" --windowed "${pythonScriptPath}"`;

            exec(pyInstallerCommand, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error generating executable:', stderr);
                    return res.status(500).send('Error generating executable');
                }

                console.log("Step 4: Executable generated successfully.");
                progressStore[requestId] = 80; // 80% completed

                // Path to the generated executable
                let exePath = path.join(distFolder, 'slideshow.exe');
                let alternateExePath = path.join(distFolder, 'slideshow'); // For Ubuntu

                console.log("Executable path:", exePath);
                const scrPath = path.join(distFolder, 'slideshow.scr');

                // Check if the generated file exists and rename it
                console.log((fs.existsSync(exePath) || fs.existsSync(alternateExePath)))

                // Check if the generated file exists (for Windows or Linux)
                if (fs.existsSync(exePath) || fs.existsSync(alternateExePath)) {
                    // Use the correct path based on which one exists
                    exePath = fs.existsSync(exePath) ? exePath : alternateExePath;

                    // Rename the executable to .scr
                    fs.renameSync(exePath, scrPath);
                    console.log('File renamed from slideshow executable to slideshow.scr');
                } else {
                    console.error('Executable file not found after PyInstaller build');
                    return res.status(500).send('Executable file not found');
                }

                // Log file stats for debugging
                const fileStats = fs.statSync(scrPath);
                // console.log(`File stats for ${scrPath}:`, fileStats);

                // Read the .scr file and encode it as base64
                const file = fs.readFileSync(scrPath);
                const base64File = file.toString('base64');
                console.log("Step 5: Base64 encoding successful...");
                progressStore[requestId] = 100; // 100% completed
                // After sending the response, clean up temporary files
                //cleanUp(imagesFolder, pythonScriptPath, exePath, scrPath);
                // Send the base64 file as a JSON response
                return res.json({ base64File, requestId });



            });
        } catch (err) {
            console.error('Error processing screensaver request:', err);
            return next(new ErrorHandler("Error processing screensaver request", 500));
        }
    });
});

// Endpoint to check progress
exports.getProgress = (req, res) => {

    const { requestId } = req.params;
    console.log(requestId);
    const progress = progressStore[requestId] || 0;
    res.json({ progress });
};

// Function to create the Python script content dynamically
function createPythonScript(images, interval) {
    let pythonScript = `
import os
import random
import time
import pygame
import sys  # Import sys for _MEIPASS
from io import BytesIO
from PIL import Image

# Initialize Pygame
pygame.init()

# Set the screen to full-screen mode
screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
pygame.display.set_caption("Image Slideshow")

# Set up the path to access bundled images
base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))

# List of image files
image_files = [
`;

    images.forEach((image, index) => {
        pythonScript += `    os.path.join(base_path, "images/image${index + 1}${path.extname(image.originalname)}"),\n`;
    });

    pythonScript += `]

# Function to load images into Pygame
def load_image(image_path):
    return pygame.image.load(image_path)

# Shuffle images to randomize the slideshow
random.shuffle(image_files)

# Function to display images
def show_images():
    while True:
        for image_file in image_files:
            image = load_image(image_file)
            image = pygame.transform.scale(image, (screen.get_width(), screen.get_height()))
            screen.blit(image, (0, 0))
            pygame.display.update()
            
            start_time = time.time()
            while time.time() - start_time < ${interval}:  # Adjust delay as needed
                for event in pygame.event.get():
                    # Exit on any keyboard or mouse action
                    if event.type in (pygame.KEYDOWN, pygame.MOUSEBUTTONDOWN):
                        pygame.quit()
                        return

# Start the slideshow
show_images()

# Quit Pygame
pygame.quit()
    `;

    return pythonScript;
}

// Function to clean up images and generated files
function cleanUp(imagesFolder, pythonScriptPath, exePath, scrPath) {
    try {
        fs.removeSync(imagesFolder); // Remove the 'images' folder
        fs.removeSync(pythonScriptPath); // Remove the Python script
        fs.removeSync(exePath); // Remove the executable
        fs.removeSync(scrPath); // Remove the executable
    } catch (err) {
        console.error('Error during cleanup:', err);
    }
}