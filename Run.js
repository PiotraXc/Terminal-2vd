const fs = require('fs');
const { exec } = require('child_process');
const asciify = require('asciify-image');
const readline = require('readline');

const framesDir = './frames';

// Create frames directory if it doesn't exist
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to extract frames using FFmpeg
const extractFrames = (videoPath) => {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i "${videoPath}" -vf "fps=10" ${framesDir}/frame%03d.png`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

// Function to play ASCII frames in the terminal
const playAsciiVideo = async () => {
  const files = fs.readdirSync(framesDir).filter(file => file.endsWith('.png')).sort();
  
  for (const file of files) {
    const asciiFrame = await asciify(`${framesDir}/${file}`, { fit: 'box', width: 80 });
    
    // Clear the console and display frame
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.log(asciiFrame);

    // Delay to simulate frame rate
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// Prompt user to enter video path
rl.question('Enter the path to your video file: ', (videoPath) => {
  extractFrames(videoPath)
    .then(() => {
      console.log('Frames extracted successfully. Playing video...');
      return playAsciiVideo();
    })
    .catch(error => console.error("Error:", error))
    .finally(() => rl.close());
});
