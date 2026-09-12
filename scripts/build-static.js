const fs = require('node:fs/promises');
const path = require('node:path');

const projectDir = path.resolve(__dirname, '..');
const publicDir = path.join(projectDir, 'public');
const defaultOutputDir = path.join(projectDir, 'dist');

function normalizeBasePath(basePath = '') {
  if (basePath === '' || basePath === '/') return '';
  if (!basePath.startsWith('/')) throw new Error('The base path must begin with "/".');
  return basePath.replace(/\/+$/, '');
}

function outputPathForHtml(relativePath) {
  const directory = path.dirname(relativePath);
  const fileName = path.basename(relativePath, '.html');
  if (fileName === 'index') return path.join(directory, 'index.html');
  return path.join(directory, fileName, 'index.html');
}

function rewriteRootRelativeHtmlUrls(contents, basePath) {
  return contents.replace(/\b(href|src)=(['"])\/(?!\/)([^'"]*)\2/g, (match, attribute, quote, target) => `${attribute}=${quote}${basePath}/${target}${quote}`);
}

function rewriteRootRelativeCssUrls(contents, basePath) {
  return contents.replace(/url\((['"]?)\/(?!\/)([^)'"\s]+)\1\)/g, (match, quote, target) => `url(${quote}${basePath}/${target}${quote})`);
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  }));
  return files.flat();
}

async function buildStaticSite({ basePath = '', outputDir = defaultOutputDir } = {}) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const resolvedOutputDir = path.resolve(outputDir);
  const sourceFiles = await listFiles(publicDir);

  await fs.rm(resolvedOutputDir, { recursive: true, force: true });

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(publicDir, sourceFile);
    const extension = path.extname(sourceFile);
    const destination = extension === '.html'
      ? path.join(resolvedOutputDir, outputPathForHtml(relativePath))
      : path.join(resolvedOutputDir, relativePath);

    await fs.mkdir(path.dirname(destination), { recursive: true });

    if (extension === '.html') {
      const contents = await fs.readFile(sourceFile, 'utf8');
      await fs.writeFile(destination, rewriteRootRelativeHtmlUrls(contents, normalizedBasePath));
    } else if (extension === '.css') {
      const contents = await fs.readFile(sourceFile, 'utf8');
      await fs.writeFile(destination, rewriteRootRelativeCssUrls(contents, normalizedBasePath));
    } else {
      await fs.copyFile(sourceFile, destination);
    }
  }

  return resolvedOutputDir;
}

function parseArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--base-path') {
      options.basePath = args[index + 1];
      index += 1;
    } else if (args[index] === '--out') {
      options.outputDir = args[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${args[index]}`);
    }
  }
  return options;
}

if (require.main === module) {
  buildStaticSite(parseArguments(process.argv.slice(2)))
    .then(outputDir => console.log(`Built static site in ${outputDir}`))
    .catch(error => {
      console.error(error.message);
      process.exitCode = 1;
    });
}

module.exports = { buildStaticSite, normalizeBasePath, outputPathForHtml };
