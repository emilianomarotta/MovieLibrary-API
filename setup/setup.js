const fs = require('fs');
const path = require('path');


function setup() {
    const folderPath = path.join(__dirname, '../data/');
    const usersFilePath = path.join(folderPath, 'users.txt');
    const favoritesFilePath = path.join(folderPath, 'favorites.txt');
    const invalidTokensFilePath = path.join(folderPath, 'invalidTokens.txt');

    createFolder(folderPath);
    createFiles(usersFilePath);
    createFiles(favoritesFilePath);
    createFiles(invalidTokensFilePath);
}



function createFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

function createFiles(filePath, separator) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', 'utf-8');
    }
}

module.exports = setup;