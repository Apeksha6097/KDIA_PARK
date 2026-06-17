const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'assets', 'images');

// List of remote images to download and optimize
const remoteImages = [
    {
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop", // resized to 1200 for responsive loading
        dest: "solar1_opt.webp"
    },
    {
        url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop",
        dest: "solar2_opt.webp"
    },
    {
        url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop",
        dest: "solar3_opt.webp"
    },
    {
        url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1200&auto=format&fit=crop",
        dest: "solar4_opt.webp"
    },
    {
        url: "https://wepitch.uk/kdia/assets/images/solar4.jpeg",
        dest: "logo_icon.webp"
    }
];

// Local images to optimize directly
const localImages = [
    "logo.png",
    "solar1.jpeg",
    "solar2.jpeg",
    "solar3.jpeg",
    "solar4.jpeg"
];

async function downloadAndOptimize(item) {
    try {
        console.log(`Downloading ${item.url}...`);
        const response = await fetch(item.url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        
        const destPath = path.join(IMAGES_DIR, item.dest);
        console.log(`Optimizing and saving to ${destPath}...`);
        
        await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(destPath);
        
        console.log(`Successfully optimized: ${item.dest}`);
    } catch (err) {
        console.error(`Error processing remote image ${item.dest}:`, err.message);
    }
}

async function optimizeLocal(filename) {
    try {
        const srcPath = path.join(IMAGES_DIR, filename);
        if (!fs.existsSync(srcPath)) {
            console.log(`Local file not found: ${filename}, skipping.`);
            return;
        }
        
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        const destPath = path.join(IMAGES_DIR, `${name}.webp`);
        
        console.log(`Optimizing local image ${filename} -> ${name}.webp...`);
        
        await sharp(srcPath)
            .webp({ quality: 80 })
            .toFile(destPath);
            
        console.log(`Successfully optimized: ${name}.webp`);
    } catch (err) {
        console.error(`Error processing local image ${filename}:`, err.message);
    }
}

async function main() {
    // Ensure images dir exists
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    console.log("=== STARTING IMAGE OPTIMIZATION ===");
    
    // Process local files
    for (const file of localImages) {
        await optimizeLocal(file);
    }
    
    // Process remote files
    for (const item of remoteImages) {
        await downloadAndOptimize(item);
    }
    
    console.log("=== IMAGE OPTIMIZATION COMPLETED ===");
}

main();
