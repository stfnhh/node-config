const ENCRYPTED_CONFIG_BY_COUNTRY = {
  es: {
    development: {
      myKey: 'FDeejskyJNoZmRmQTPREHA==--SlFF0O9iHgKpcds+/6nbEg==',
    },
    test: {
      myKey: 'QWSC50SjwkuJPKd4ai28/SDMwnBFQk65NtGULitfdpE=--SlFF0O9iHgKpcds+/6nbEg==',
    },
    production: {
      myKey: 'Ij51M8OJbccvCuQXpspk6ElWDE7lcKZlbOibkbYyOe4Zwos+g023c8gqLGkdQslA--SlFF0O9iHgKpcds+/6nbEg==',
    },
  },
  en: {
    development: {
      myKey: 'kFfqQ4FhBmaRKELWa8oI3g==--SlFF0O9iHgKpcds+/6nbEg==',
    },
    test: {
      myKey: 'rQBESsoUIctZrvPFAp+NZNHiSXwz4qP4fdMmslS4tHY=--SlFF0O9iHgKpcds+/6nbEg==',
    },
    production: {
      myKey: 'Ij51M8OJbccvCuQXpspk6ElWDE7lcKZlbOibkbYyOe4Zwos+g023c8gqLGkdQslA--SlFF0O9iHgKpcds+/6nbEg==',
    },
  },
};

const ENCRYPTED_CONFIG_BY_ENV = {
  development: {
    myKey: 'lS0EEUI3YfnJvjNlQUq8NQrHSWNIW7OupQPYWMl8CJI=--q5V4y7tw2m84/faTZ8iQUA==',
  },
  test: {
    myKey: 'c3z13L5lt+sbUsW7ZAEpmQ==--RCxwxLjwWe0uRy8z3yNVBA==',
  },
  production: {
    myKey: 'LcRsch3a9TwWo+4k+KjZWzgi8Lq4RboOTQ9HeQbBSyc6RwTcMhZ6PIb/7bPXSRRK--jcVpnY+Hkdiv4gs75p8fZg==',
  },
};

const ENCRYPTED_CONFIG = {
  myKey: 'Gum+XHqHtKmFG5kojUpAZg==--gxV2qVVHRWNn9AqrSQ6MTA==',
  myKeyEnv: 'yTwUP5dm9regseZ4KSiIeqp2fgLhSmW0FmzsFNpWvcQk6jmMyStKkDknXm0WxsO2--gxV2qVVHRWNn9AqrSQ6MTA==',
};

const DECRYPTED_CONFIG = {
  myKey: 'password',
  myKeyEnv: '<%= process.env.ENV_CREDENTIAL %>',
};

module.exports = {
  ENCRYPTED_CONFIG_BY_ENV,
  ENCRYPTED_CONFIG_BY_COUNTRY,
  ENCRYPTED_CONFIG,
  DECRYPTED_CONFIG,
};
