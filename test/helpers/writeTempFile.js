const fs = require('fs');

const writeTempFile = (data, uuid = new Date().getTime()) => {
  const path = `/tmp/${uuid}-config.json`;
  fs.writeFileSync(path, JSON.stringify(data));
  return { path, uuid };
};
exports.writeTempFile = writeTempFile;
