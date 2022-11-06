const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const path = require('path');
const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');


async function createCopyDirectory() {
  try {
    await mkdir(filesCopyPath, { recursive: true });
    await clearCopyDirectory();

    const files = await readdir(filesPath);

    for (let file of files) {
      await copyFile(path.join(filesPath, file), path.join(filesCopyPath, file));
    }

  } catch (err) {
    console.error(err);
  }
}

async function clearCopyDirectory() {
  const filesCopyDirectory = await readdir(filesCopyPath);

  for (let file of filesCopyDirectory) {
    await rm(path.join(filesCopyPath, file), { force: true });
  }
}

createCopyDirectory();