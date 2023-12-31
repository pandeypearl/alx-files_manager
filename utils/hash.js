/**
 * Hash for Password
 */
import crypto from 'crypto';

module.exports = (password) => crypto.createHash('sha1').update(password).digest('hex');
