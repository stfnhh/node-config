interface IConfigOptions {
  masterKey?: string;
  path?: string;
  nodeEnv?: string;
}

declare class Vault {
  constructor(options: {
    encryptFnc?: (encKey: string, text: string, ivBase64?: string) => string;
    decryptFnc?: (encKey: string, text: string) => [string, string];
    configFilePath?: string;
    nodeEnv?: string;
    masterKey?: string;
  });

  config: any;
  env: any;
  _config(options?: IConfigOptions): any;
}
declare const vault: Vault;
declare const config: any;
declare const env: any;
declare const configuration: (options?: IConfigOptions) => any;

export { config, env, configuration, Vault };
export default vault;
