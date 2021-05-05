const fs = require('fs');
const commandLineUsage = require('command-line-usage');
const Vault = require('./vault').Vault;
const { editContentInEditor } = require('./editContentInEditor');

const init = ({ path }) => {
  const vault = new Vault({ configFilePath: path });
  if (fs.existsSync(`${vault.configFilePath}.key`)) {
    console.log('Warning config.yaml.key exists, delete config.yaml.key to generate new key');
  } else {
    const masterKey = vault.getMasterKey(false) || vault.createNewKey();
    fs.writeFileSync(`${vault.configFilePath}.key`, masterKey);
    vault
      .encryptFile()
      .then(() => {
        try {
          fs.unlinkSync(`${vault.configFilePath}.iv`);
        } catch {}
      })
      .catch((error) => console.error(error));
  }
};

const encrypt = async ({ path }) => {
  const vault = new Vault({ configFilePath: path });
  vault
    .encryptFile()
    .then(() => {})
    .catch(console.error);
};

const edit = async ({ path }) => {
  const vault = new Vault({ configFilePath: path });
  const masterKey = vault.getMasterKey();

  try {
    const [content, iv] = vault.decryptFnc(masterKey, fs.readFileSync(vault.configFilePath, 'utf-8'));
    const mewContent = await editContentInEditor(content);
    const encyptedContent = await vault.encryptFnc(masterKey, mewContent, iv);
    fs.writeFileSync(vault.configFilePath, encyptedContent);
  } catch (err) {
    console.error(err);
  }
};

const decrypt = ({ path }) => {
  const vault = new Vault({ configFilePath: path });
  vault.decryptFile();
};

const help = () => {
  const sections = [
    {
      header: 'node-vault',
      content: 'encrypted your config',
    },
    {
      header: 'Synopsis',
      content: 'node-vault <command> <options>',
    },
    {
      header: 'Command List',
      content: [
        { name: 'help', summary: 'help' },
        {
          name: 'init',
          summary: 'encrypt your config file and create a config key file',
        },
        { name: 'encrypt', summary: 'encrypt config file' },
        { name: 'decrypt', summary: 'decrypt config file' },
        { name: 'edit', summary: 'decrypt/encrypt in text editor' },
      ],
    },
    {
      header: 'Options',
      content: [{ name: '-p, --path', summary: 'Path for config file' }],
    },
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
};

module.exports = {
  init,
  encrypt,
  edit,
  decrypt,
  help,
};
