const fs = require('fs');
const path = require('path');
const svgSprite = require('svg-sprite');

const config = {
  dest: "./app/temp/sprite",
  mode: {
    css: {
      sprite: 'sprite.svg',
      render: {
        css: {
          template: './gulp/templates/sprite.css',
        },
      },
    },
  },
};

async function cleanDirectories() {
  const spriteDir = './app/temp/sprite';
  const spritesDir = './app/assets/images/sprites';
  fs.rmdirSync(spriteDir, { recursive: true });
  fs.rmdirSync(spritesDir, { recursive: true });
}

async function createSprite() {
  const iconsDir = './app/assets/images/icons';
  const spriteDir = './app/temp/sprite';
  const sprite = new svgSprite(config);
  const svgFiles = fs.readdirSync(iconsDir);

  svgFiles.forEach((file) => {
    if (file.endsWith('.svg')) {
      const svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf-8');
      sprite.add(file, null, svgContent);
    }
  });

  sprite.compile((error, result) => {
    if (error) {
      console.error('Error creating sprite:', error);
      return;
    }

    // Write sprite files to disk
    for (const mode in result) {
      for (const resource in result[mode]) {
        const filePath = result[mode][resource].path;
        const fileContents = result[mode][resource].contents;

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, fileContents);
      }
    }

    console.log('Sprite created successfully!');
  });
}

async function copySpriteFiles() {
  const spriteDir = './app/temp/sprite/css';
  const cssDir = './app/assets/styles/modules';
  const spritesDir = './app/assets/images/sprites';

  fs.mkdirSync(spritesDir, { recursive: true });

  // Read all files in the sprite directory
  const svgFiles = fs.readdirSync(spriteDir);

  // Copy each SVG file
  svgFiles.forEach((file) => {
    if (file.endsWith('.svg')) {
      const srcPath = path.join(spriteDir, file);
      const destPath = path.join(spritesDir, file);
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Copy the sprite CSS file
  fs.copyFileSync(path.join(spriteDir, 'sprite.css'), path.join(cssDir, '_sprite.css'));

  console.log('Sprite files copied successfully!');
}

async function runTasksSequentially() {
  try {
    await cleanDirectories();
    await createSprite();
    await copySpriteFiles();
    console.log('All tasks completed successfully!');
  } catch (error) {
    console.error('Error executing tasks:', error);
  }
}

// Call the function to start running tasks sequentially
runTasksSequentially();
