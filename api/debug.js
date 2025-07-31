export default function handler(req, res) {
  const fs = require('fs');
  const path = require('path');
  
  // Debug information
  const debug = {
    cwd: process.cwd(),
    __dirname: __dirname,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    directories: {}
  };
  
  // Check what directories exist
  const checkDir = (dirPath, name) => {
    try {
      const exists = fs.existsSync(dirPath);
      const files = exists ? fs.readdirSync(dirPath).slice(0, 10) : [];
      debug.directories[name] = { exists, files };
    } catch (e) {
      debug.directories[name] = { exists: false, error: e.message };
    }
  };
  
  checkDir('.', 'root');
  checkDir('./dist', 'dist');
  checkDir('./public', 'public');
  checkDir('../dist', '../dist');
  checkDir('../../dist', '../../dist');
  
  // Check index.html content if exists
  const checkIndexHtml = (filePath, name) => {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const hasSrcMain = content.includes('/src/main.tsx');
        const hasAssets = content.includes('/assets/');
        debug[name] = { exists: true, hasSrcMain, hasAssets, size: content.length };
      } else {
        debug[name] = { exists: false };
      }
    } catch (e) {
      debug[name] = { exists: false, error: e.message };
    }
  };
  
  checkIndexHtml('./index.html', 'rootIndex');
  checkIndexHtml('./dist/index.html', 'distIndex');
  checkIndexHtml('../dist/index.html', '../distIndex');
  
  res.status(200).json(debug);
}