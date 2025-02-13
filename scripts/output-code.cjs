const fs = require('fs').promises;
const path = require('path');

// Obtener __dirname de manera compatible
const rootDir = path.resolve(__dirname, '..');

// Array de rutas excluidas
const excludedPaths = ['node_modules', '.next', '.git'];

// Array de rutas incluidas (ajustado para NestJS)
const includedPaths = [
  'src',
  'tsconfig.build.json',
  'package.json',
  'tsconfig.json',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yml',
  '_upload_',
  'nest-cli.json',
  '.vscode',
];

// Función para verificar si un archivo/directorio debe ser excluido
const isExcluded = (filePath) =>
  excludedPaths.some((excluded) => filePath.includes(excluded));

// Función para verificar si un archivo/directorio debe ser incluido
const isIncluded = (filePath) =>
  includedPaths.some((included) => filePath.includes(included));

// Función para remover comentarios del contenido de un archivo
const removeComments = (content) => {
  content = content.replace(/\/\/.*/g, ''); // Comentarios de una línea
  content = content.replace(/\/\*[\s\S]*?\*\//g, ''); // Comentarios multilínea
  return content
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
};

// Función recursiva para obtener todos los archivos de un directorio
async function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dirPath, file.name);

      if (file.isDirectory() && !isExcluded(filePath)) {
        arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
      } else if (!isExcluded(filePath)) {
        arrayOfFiles.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error leyendo directorio: ${dirPath}`, error);
  }

  return arrayOfFiles;
}

// Función principal para procesar los archivos
async function processFiles() {
  try {
    let allFiles = [];

    // Obtener archivos en `src/`
    allFiles = await getAllFiles(rootDir);
    allFiles = allFiles.filter(isIncluded);

    let outputContent = '';

    for (const filePath of allFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        outputContent += `// File: ${filePath}\n`;
        outputContent += removeComments(content);
        outputContent += '\n\n/**********/\n\n';
        console.log(`Archivo procesado: ${filePath}`);
      } catch (err) {
        console.error(`Error procesando archivo ${filePath}:`, err);
      }
    }

    const outputPath = path.join(__dirname, 'output-code.txt');
    await fs.writeFile(outputPath, outputContent);
    console.log(`✅ Código guardado en: ${outputPath}`);
  } catch (err) {
    console.error('❌ Error procesando archivos:', err);
  }
}

// Ejecutar el script
processFiles();
