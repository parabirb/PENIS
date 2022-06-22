/*
    PENIS
    The Steganographic Stash
    Written by parabirb
    Public domain.
*/

// deps
const bmp = require("bmp-js");
const crypto = require("crypto");

// helper function
function bytesToInt(a, b, c) {
    return a << 16 | b << 8 | c;
}
function intToBytes(a) {
    return [(a & 0xff0000) >> 16, (a & 0xff00) >> 8, a & 0xff];
}
function bytesToBits(bytes) {
    let result = [];
    for (let byte of bytes) result.push(...byte.toString(2).padStart(8, "0").split("").map(x => +x));
    return result;
}
function bitsToBytes(bits) {
    let bytes = [];
    let bitString = bits.join("");
    for (let i = 0; i < Math.floor(bitString.length / 8) * 8; i += 8) {
        bytes.push(parseInt(bitString.substring(i, i + 8), 2));
    }
    return Buffer.from(bytes);
}
function putBitsInRgb(rgb, bits) {
    for (let i = 0; i < bits.length; i += 3) {
        for (let j = 1; j <= 3; j++) rgb[i + (i / 3) + j] = (rgb[i + (i / 3) + j] & 0b11111110) | bits[i + j - 1];
    }
}
function takeBitsOutOfRgb(rgb) {
    let bits = [];
    for (let i = 1; i < rgb.length - (rgb.length / 4); i += 4) {
        bits.push(rgb[i] & 1, rgb[i + 1] & 1, rgb[i + 2] & 1);
    }
    return bits;
}
function putBytesInRgb(rgb, bytes) {
    putBitsInRgb(rgb, bytesToBits(bytes));
}
function takeBytesOutOfRgb(rgb) {
    return bitsToBytes(takeBitsOutOfRgb(rgb));
}
function bytesToInts(bytes) {
    let ints = [];
    for (let i = 0; i < bytes.length; i += 3) {
        ints.push(bytesToInt(bytes[i], bytes[i + 1], bytes[i + 2]));
    }
    return ints;
}
function intsToBytes(ints) {
    let bytes = [];
    for (let int of ints) bytes.push(...intToBytes(int));
    return Buffer.from(bytes);
}

// functions
function fromBmp(bytes, password) {
    let rgb = bmp.decode(bytes).data;
    let data = takeBytesOutOfRgb(rgb);
    let salt = data.subarray(0, 16);
    data = data.subarray(16);
    let iv = data.subarray(0, 16);
    data = data.subarray(16);
    data = data.subarray(0, bytesToInts(data).indexOf(0xe621fa) * 3);
    let scrypt = crypto.scryptSync(password, salt, 32);
    let decipher = crypto.createDecipheriv("CAMELLIA-256-OFB", scrypt, iv);
    let decryptedBytes = decipher.update(data);
    decryptedBytes = Buffer.concat([decryptedBytes, decipher.final()]);
    return bytesToInts(decryptedBytes);
}
function toBmp(ints, bytes, password) {
    let image = bmp.decode(bytes);
    let data = image.data;
    let salt = crypto.randomBytes(16);
    let iv = crypto.randomBytes(16);
    let scrypt = crypto.scryptSync(password, salt, 32);
    let cipher = crypto.createCipheriv("CAMELLIA-256-OFB", scrypt, iv);
    let outputBytes = cipher.update(intsToBytes(ints));
    outputBytes = Buffer.concat([salt, iv, outputBytes, cipher.final(), Buffer.from("e621fa", "hex")]);
    putBytesInRgb(data, outputBytes);
    return bmp.encode({ data, width: image.width, height: image.height }).data;
}

module.exports = {
    fromBmp,
    toBmp
};