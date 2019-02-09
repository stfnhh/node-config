const core = require("./core");
var fs = require("fs");

const createNewKey = (path = "./credentials.json.key") => {
  fs.writeFileSync(path, core.newKey());
};
module.exports.createNewKey = createNewKey;

const encrypt = async ({
  credentialsFilePath = "credentials.json",
  keyValue = process.env.NODE_MASTER_KEY
} = {}) => {
  const key =
    keyValue || fs.readFileSync(`${credentialsFilePath}.key`, "utf8").trim();
  const text = fs.readFileSync(credentialsFilePath, "utf8").trim();
  const cipherBundle = await core.encrypt(key, text);
  fs.writeFileSync(`${credentialsFilePath}.enc`, cipherBundle);
  return `${credentialsFilePath}.enc`;
};

exports.encrypt = encrypt;

const editCredentials = ({
  encryptedFilePath = "credentials.json.enc",
  keyPath = "credentials.json.key",
  keyValue = process.env.NODE_MASTER_KEY
} = {}) => {
  const key = keyValue || fs.readFileSync(keyPath, "utf8").trim();
  const credentialsEnryptedText = fs.readFileSync(encryptedFilePath, "utf8");
  const decryptCredentials = core.decrypt(key, credentialsEnryptedText);
  const credentials = JSON.parse(decryptCredentials);
  return credentials;
};
exports.editCredentials = editCredentials;

const decrypt = ({
  encryptedFilePath = "credentials.json.enc",
  keyPath = "credentials.json.key",
  outPath = "credentials.json"
} = {}) => {
  const credentials = core.decrypt(keyPath, encryptedFilePath);
  fs.writeFileSync(outPath, JSON.stringify(credentials), "utf8");
  return outPath;
};
module.exports.decrypt = decrypt;
