const crypto = require('crypto');

const keyPair = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096, // bits - standard for RSA keys
  publicKeyEncoding: {
    type: 'pkcs1', // "Public Key Cryptography Standards 1"
    format: 'pem', // Most common formatting choice
  },
  privateKeyEncoding: {
    type: 'pkcs1', // "Public Key Cryptography Standards 1"
    format: 'pem', // Most common formatting choice
  },
});

console.log(keyPair.publicKey);
console.log(keyPair.privateKey);
