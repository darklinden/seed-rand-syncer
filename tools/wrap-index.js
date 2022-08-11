import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, '..', 'src');
const folder_read = fs.readdirSync(src, { withFileTypes: true });

const folders = [];
folder_read.forEach(file => {
    if (file.isDirectory()) {
        folders.push(file.name);
    }
});

// callback(root, relative file name) 
function walkDir(root, relative, callback) {
    const full = path.join(root, relative);
    fs.readdirSync(full).forEach(f => {
        if (fs.statSync(path.join(full, f))?.isDirectory())
            walkDir(root, path.join(relative, f), callback)
        else
            callback(root, path.join(relative, f));
    });
}

let content = '';
const files = []

walkDir('src', '', (root, f) => {
    files.push(f);
});

files.forEach(file => {
    if (file.endsWith('.ts') && !file.includes('index.ts')) {
        const bn = file.substring(0, file.length - 3);
        content += 'export * from \'./' + bn + '\';\n';
    }
});

const index_path = path.join(src, 'index.ts');
fs.writeFileSync(index_path, content);