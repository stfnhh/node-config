# Node encrypted secrets

Manage your secrets with single entrypted file.
Inspired in [Rails encrypted secrets management](https://rubyinrails.com/2018/02/24/rails-5-1-encrypted-secrets-management-feature/)

## Install

```
npm install node-config --save
```

## Usage

### Encrypt and decrypt yaml files

```yaml
# config.yaml
username: user
password': myPassword
```

- Encrypt

```
NODE_MASTER_KEY=$MASTER_KEY npx node-config encrypt --path config.yaml
```

Only encrypted object values.

```yaml
username: sGPi7jVJFORTBSOOKx5nMw==--eYed5TIh3D+9rjN/usOB0w==
password: +C4M+xFxOQXTyvPJ7QSJuQ==--eYed5TIh3D+9rjN/usOB0w==
```

- Decrypt

```
NODE_MASTER_KEY=$MASTER_KEY npx node-config decrypt --path config.yaml
```

## Setup for NodeJs projects

Create a config.yaml file

Example:

```yaml
publicKey: publicValue # no-encrypt
myApiKey: apiKey
myApiSecret: apiSecret
```

or

```json
{
  "publicKey": "publicValue",
  "myApiKey": "apiKey",
  "myApiSecret": "apiSecret"
}
```

```
npx node-config init
```

OR use your own key

```
NODE_MASTER_KEY=$MASTER_KEY npx node-config init
```

Your config file it's encrypted, and generate config key file

Save the key value, and ignore this file in your version control.

```
echo config.yaml.key >> .gitignore
```

### Read config in runtime

```js
const { config } = require('node-config');

const apiKey = config.apiKey;
```

### Use in production

You can set a environment varible NODE_MASTER_KEY for decrypt secrets.

```
NODE_MASTER_KEY=my-credential-key server.js
```

### Edit config

The edit command allow to edit the file in a text editor; decrypting before open the file and encrypting after close the file.

```
EDITOR=nano npx node-config edit
```

### env

Return the value of config based on process.env.NODE_CREDENTIALS_ENV or process.env.NODE_ENV
Example:

```yaml
default: &default
  user: myuser
development:
  <<: *default
  key: password_development
production:
  <<: *default
  key: password_production
```

- By default use development key

```js
const vault = require('node-config');

vault.config;
// { development: { key: "password_development" }, production: { key: "password_production" } }
vault.env;
// { key: "password_development" }
```

- Set custom environment

```yaml
us:
  development:
    key: development password for US country
```

```
NODE_CREDENTIALS_ENV=us.development node main.js
```

```javascript
const vault = require('node-config');
vault.env;
// { key: "development password for US country" }
```

### Environment variable in config file

Some config it's not recomend set in config file, like production database password.

config file accept template variables for process env object

```yaml
production:
  database:
    password: <%= process.env.DATABASE_PASSWORD %>
```

## CLI API

```
Command List

  help      help
  init      encrypt your config file and create a config key file
  encrypt   encrypt config file
  decrypt   decrypt config file
  edit      decrypt/encrypt in text editor

Options

  -p, --path   Path for config file
```
