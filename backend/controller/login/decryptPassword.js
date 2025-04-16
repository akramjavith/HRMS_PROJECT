const crypto = require('crypto');

const decryptPassword = (encryptedPassword, salt) => {
  const key = crypto.scryptSync('password', salt, 24);
  const iv = Buffer.alloc(16, 0); // Initialization vector
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
  let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
  decryptedPassword += decipher.final('utf8');
  return decryptedPassword;
};

module.exports = { decryptPassword };
