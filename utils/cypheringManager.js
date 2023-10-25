// Import module into your application
const crypto = require('crypto')


const cypherText = (textToCypher,secretKey) => {
//const secretKey = crypto.randomBytes(32);
    // Generate an initialization vector
    const iv = crypto.randomBytes(16);

    // create cipher object
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey), iv);

    // encrypt the data
    let encryptedText = cipher.update(textToCypher, "utf-8", "hex");

    // finalize the encryption
    encryptedText += cipher.final("hex");

    return iv.toString('hex') + ':' + encryptedText 
}

const decypherText = (textToDecypher,secretKey) => {

    if (textToDecypher.indexOf(":") <= -1){
        return textToDecypher
    }
    const parts = textToDecypher.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
  
    // create Decipher object
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey), iv);

    // decrypt the data
    let decryptedText = decipher.update(encrypted, "hex", "utf-8");

    // finalize the decryption
    decryptedText += decipher.final("utf-8");

    return decryptedText; // This is a secret message

}

const hashText = textToHash => {
    const hash = crypto.createHash('sha256');
    
    hash.update(textToHash);
    const hashedData = hash.digest('hex');

    return hashedData;
}
module.exports = {
    cypherText,
    decypherText,
    hashText
}