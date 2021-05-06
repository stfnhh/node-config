const YAML = require('yaml');
const { get } = require('lodash');
const fs = require('fs');
const core = require('./core');
const render = require('./template-render').render;

class Vault {
  constructor({
    decryptFnc,
    encryptFnc,
    configFilePath,
    nodeEnv = process.env.NODE_CONFIG_ENV || process.env.NODE_ENV || 'development',
    masterKey,
  } = {}) {
    this.configFilePath = this._inferConfigFilePath(configFilePath);
    this.format = "yaml";
    const adapter = this._getAdapter(decryptFnc, encryptFnc);
    this.decryptFnc = adapter.decryptFnc;
    this.encryptFnc = adapter.encryptFnc;
    this.parser = adapter.parser;
    this.masterKey = masterKey;
    this._config = {};
    this._env = {};
    this.nodeEnv = nodeEnv === '' ? 'development' : nodeEnv;
    this.configured = false;
  }

  get config() {
    if (!this.configured) {
      this.configuration();
    }
    return this._config;
  }

  get env() {
    if (!this.configured) {
      this.configuration();
    }
    return this._env;
  }

  _inferConfigFilePath(configFilePath) {
    if (configFilePath) return configFilePath;
    if (fs.existsSync('config.yaml')) return 'config.yaml';
    if (fs.existsSync('config.yaml.enc')) return 'config.yaml';
    if (fs.existsSync('config.yml')) return 'config.yml';
    if (fs.existsSync('config.yml.enc')) return 'config.yml';
    return 'config.yaml';
  }

  _getAdapter(decryptFnc, encryptFnc) {
    return { parser: YAML, decryptFnc: core.decryptYAML, encryptFnc: core.encryptYAML };
  }

  setConfig(config) {
    this._config = { ...config };
    this._env = get(config, this.nodeEnv, {});
  }

  configuration({ masterKey, path, nodeEnv } = {}) {
    if (masterKey) this.masterKey = masterKey;
    if (path) this.configFilePath = path;
    if (nodeEnv) this.nodeEnv = this.nodeEnv;

    const key = this.getMasterKey();
    const text = fs.readFileSync(`${this.configFilePath}.enc`, 'utf8');
    const [configText, iv] = this.decryptFnc(key, text);
    const configTextRendered = render(configText);
    const config = this.parser.parse(configTextRendered);
    this.setConfig(config);
    this.configured = true;
    return config;
  }

  async encryptFile() {
    const masterKey = this.getMasterKey(true);
    const text = fs.readFileSync(this.configFilePath, 'utf8').trim();
    let iv;
    try {
      iv = fs.readFileSync(`${this.configFilePath}.iv`, 'utf8').trim();
    } catch {
      iv = null;
    }
    const cipherBundle = await this.encryptFnc(masterKey, text, iv);
    fs.writeFileSync(`${this.configFilePath}.enc`, cipherBundle);
    try {
      fs.unlinkSync(`${this.configFilePath}.iv`, 'utf8');
    } catch {}
    fs.unlinkSync(`${this.configFilePath}`)
    return `${this.configFilePath}`;
  }

  decryptFile() {
    const masterKey = this.getMasterKey(true);
    const text = fs.readFileSync(`${this.configFilePath}.enc`, 'utf8');
    const [decryptConfig, iv] = this.decryptFnc(masterKey, text);
    fs.writeFileSync(`${this.configFilePath}`, decryptConfig, 'utf8');
    fs.writeFileSync(`${this.configFilePath}.iv`, iv, 'utf8');
    fs.unlinkSync(`${this.configFilePath}.enc`)
    return this.configFilePath;
  }

  createNewKey() {
    const newKey = core.newKey();
    fs.writeFileSync(`${this.configFilePath}.key`, newKey);
    return newKey;
  }

  getMasterKey(force = true) {
    try {
      return (
        this.masterKey ||
        process.env.NODE_MASTER_KEY ||
        fs.readFileSync(`${this.configFilePath}.key`, 'utf8').trim()
      );
    } catch (e) {
      if (force) {
        throw new Error('Missing master key, check .key file or the NODE_MASTER_KEY enviroment variable');
      }
      return undefined;
    }
  }
}
module.exports.Vault = Vault;
