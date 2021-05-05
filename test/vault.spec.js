const fs = require('fs');
const {
  DECRYPTED_CONFIG,
  ENCRYPTED_CONFIG_BY_COUNTRY,
  ENCRYPTED_CONFIG_BY_ENV,
  ENCRYPTED_CONFIG,
} = require('./examples/configFiles');
const { writeTempFile } = require('./helpers/writeTempFile');

const Vault = require('../src/vault').Vault;
require('./helpers/matchers');

let NODE_MASTER_KEY = '8aa93853b3ff01c5b5447529a9c33cb9';
const MY_ENV_CONFIG = 'MY_ENV_CONFIG';

process.env.NODE_MASTER_KEY = NODE_MASTER_KEY;
process.env.ENV_CONFIG = MY_ENV_CONFIG;

describe('node-vault', () => {
  test('encryptFile', async () => {
    const { path } = writeTempFile(DECRYPTED_CONFIG);

    const vault = new Vault({
      configFilePath: path,
    });

    expect(await vault.encryptFile()).validEncryptedFile();
    fs.unlinkSync(path);
  });

  test('decryptFile', async () => {
    const { path } = writeTempFile(ENCRYPTED_CONFIG);

    const vault = new Vault({
      configFilePath: path,
    });
    vault.decryptFile();
    const fileText = fs.readFileSync(path, 'utf8');

    expect(JSON.parse(fileText)).toEqual({
      myKey: 'password',
      myKeyEnv: '<%= process.env.ENV_CONFIG %>',
    });
    fs.unlinkSync(path);
  });

  test('config', () => {
    const { path } = writeTempFile(ENCRYPTED_CONFIG);

    const vault = new Vault({ configFilePath: path });
    vault.configuration();
    expect(vault.config).toEqual({
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CONFIG',
    });
  });

  test('config with auto config', () => {
    const { path } = writeTempFile(ENCRYPTED_CONFIG);

    const vault = new Vault({
      configFilePath: path,
    });

    expect(vault.config).toEqual({
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CONFIG',
    });
    expect(vault.configured).toEqual(true);
  });

  test('createNewKey', () => {
    const { path } = writeTempFile(ENCRYPTED_CONFIG);

    const vault = new Vault({ configFilePath: path });
    expect(vault.createNewKey()).toHaveLength(32);
    fs.unlinkSync(`${path}.key`);
  });
});

describe('node-vault env', () => {
  const { path } = writeTempFile(ENCRYPTED_CONFIG_BY_ENV);

  const vaultFactory = ({ nodeEnv }) => {
    return new Vault({
      nodeEnv,
      masterKey: NODE_MASTER_KEY,
      configFilePath: path,
    });
  };

  test('NODE_ENV=development', () => {
    const vault = vaultFactory({ nodeEnv: 'development' });
    expect(vault.env).toEqual({
      myKey: 'password development',
    });
  });

  test('NODE_ENV=test', () => {
    const vault = vaultFactory({ nodeEnv: 'test' });
    expect(vault.env).toEqual({
      myKey: 'password test',
    });
  });

  test('NODE_ENV=production', () => {
    const vault = vaultFactory({ nodeEnv: 'production' });
    expect(vault.env).toEqual({
      myKey: process.env.ENV_CONFIG,
    });
  });

  test('NODE_ENV=es.production', () => {
    const { path } = writeTempFile(ENCRYPTED_CONFIG_BY_COUNTRY);

    const vault = new Vault({
      nodeEnv: 'es.development',
      configFilePath: path,
    });
    console.log(vault.env)
    expect(vault.env).toEqual({ myKey: 'ES password' });
  });
});
