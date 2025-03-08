const fs = require('fs');
const { createCanvas } = require('canvas');

// Create icon.png (1024x1024)
const iconCanvas = createCanvas(1024, 1024);
const iconCtx = iconCanvas.getContext('2d');
iconCtx.fillStyle = '#FF9F45';
iconCtx.fillRect(0, 0, 1024, 1024);
fs.writeFileSync('./assets/icon.png', iconCanvas.toBuffer());

// Create adaptive-icon.png (1024x1024)
const adaptiveIconCanvas = createCanvas(1024, 1024);
const adaptiveIconCtx = adaptiveIconCanvas.getContext('2d');
adaptiveIconCtx.fillStyle = '#FF9F45';
adaptiveIconCtx.fillRect(0, 0, 1024, 1024);
fs.writeFileSync('./assets/adaptive-icon.png', adaptiveIconCanvas.toBuffer());

// Create splash.png (2048x2048)
const splashCanvas = createCanvas(2048, 2048);
const splashCtx = splashCanvas.getContext('2d');
splashCtx.fillStyle = '#FF9F45';
splashCtx.fillRect(0, 0, 2048, 2048);
fs.writeFileSync('./assets/splash.png', splashCanvas.toBuffer()); 