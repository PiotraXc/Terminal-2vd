### 3. `index.js`
This is the main JavaScript file where the conversion and playback happen.

```javascript
const fs = require('fs');
const { exec } = require('child_process');
const asciify = require('asciify-image');
const readline = require('readline');

const videoPath = 'storage/'; 
const framesDir = './frames';

// Create frames directory if it doesn't exist
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);

// Function to extract frames using FFmpeg
const extractFrames = () => {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i ${videoPath} -vf "fps=10" ${framesDir}/frame%03d.png`, (error) => {
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

// Extract frames and play video
extractFrames()
  .then(() => playAsciiVideo())
  .catch(error => console.error("Error:", error));
