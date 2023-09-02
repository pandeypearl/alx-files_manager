/**
 * Hash for Password
 */
import crypto from 'crypto';

module.exports = (password) => crypto.createHash('SHA1').update(password).digest('hex');
