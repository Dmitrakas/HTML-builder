const path = require('path');
const { readdir, readFile, appendFile, rm } = require('fs/promises');
const distDirectoryPath = path.join(__dirname, 'project-dist');
const styleDirectoryPath = path.join(__dirname, 'styles');

async function createBundle() {
  try {
    await rm(path.join(distDirectoryPath, 'bundle.css'), { force: true });
    const styleDirectory = await readdir(styleDirectoryPath, { withFileTypes: true });

    for (let file of styleDirectory) {
      const extName = path.extname(file.name);

      if (file.isFile() && extName === '.css') {
        const insides = await readFile(path.join(styleDirectoryPath, file.name), 'utf-8');
        await appendFile(path.join(distDirectoryPath, 'bundle.css'), insides + '\n');
      }
    }

  } catch (err) {
    console.error(err);
  }
}

createBundle();