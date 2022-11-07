const path = require('path');
const { readdir, readFile, mkdir, appendFile, rm, copyFile } = require('fs/promises');
const distFolderPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesBundlePath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(distFolderPath, 'assets');

async function createHtmlBundle() {
  try {
    const template = await readFile(templatePath, 'utf-8');
    const tags = new Set([...template.toString().matchAll(/\{\{.*}}/g)]);
    const tagContents = new Map();
    for (const tag of tags) {
      const tagName = tag.toString();
      const fileContent = await readFile(path.join(componentsPath, `${tagName.replace('{{', '').replace('}}', '')}.html`));
      tagContents.set(tagName, fileContent.toString());
    }
    let content = template.toString();
    for (const [tag, fileContent] of tagContents) {
      content = content.replaceAll(tag, fileContent);
    }
    await appendFile(path.join(distFolderPath, 'index.html'), content);
  } catch (err) {
    console.error(err);
  }
}

async function createCssBundle() {
  try {
    const styleDirectory = await readdir(stylesBundlePath, { withFileTypes: true });
    for (let file of styleDirectory) {
      const extName = path.extname(file.name);
      if (file.isFile() && extName === '.css') {
        const insides = await readFile(path.join(stylesBundlePath, file.name), 'utf-8');
        await appendFile(path.join(distFolderPath, 'style.css'), insides + '\n');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function createAssetsBundle(folderPath, distPath) {
  try {
    const insides = await readdir(folderPath, { withFileTypes: true });
    for (let file of insides) {
      if (file.isFile()) {
        await copyFile(path.join(folderPath, file.name), path.join(distPath, file.name));
      } else {
        const folderPathRec = path.join(folderPath, file.name);
        const distPathRec = path.join(distPath, file.name);
        await mkdir(distPathRec, { recursive: true });
        await createAssetsBundle(folderPathRec, distPathRec);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function build() {
  try {
    await rm(distFolderPath, { force: true, recursive: true });
    await mkdir(distFolderPath, { recursive: true });
    await mkdir(distAssetsPath, { recursive: true });
    await createHtmlBundle();
    await createCssBundle();
    await createAssetsBundle(assetsFolderPath, distAssetsPath);
  } catch (err) {
    console.error(err);
  }
}

build();