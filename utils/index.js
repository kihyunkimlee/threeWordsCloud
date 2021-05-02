const fs = require('fs');

module.exports.createPath = (basePath) => {
    const d = new Date();

    return basePath + '/' +  d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
};

module.exports.makeDir = (path) => {
    if (!fs.existsSync(path)){    
        fs.mkdirSync(path, { recursive: true });
    }
};