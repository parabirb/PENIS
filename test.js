const fs = require("fs");
const crypto = require("crypto");
const bmp = require("bmp-js");
const PENIS = require(".");

function bytesToInt(a, b, c) {
    return a << 16 | b << 8 | c;
}
function bytesToInts(bytes) {
    let ints = [];
    for (let i = 0; i < bytes.length; i += 3) {
        ints.push(bytesToInt(bytes[i], bytes[i + 1], bytes[i + 2]));
    }
    return ints;
}

let beforeBmp = fs.readFileSync("test_image.bmp");
let posts = bytesToInts(crypto.randomBytes(0xe622));
let afterBmp = PENIS.toBmp(posts, beforeBmp, "sex");
fs.writeFileSync("output_image.bmp", afterBmp);
let ints = PENIS.fromBmp(afterBmp, "sex");
if (ints.length !== posts.length) {
    console.log("Test failed!");
    process.exit(1);
}
for (let i = 0; i < ints.length; i++) {
    if (ints[i] !== posts[i]) {
        console.log("Test failed!");
        process.exit(1);
    }
}
console.log(`Test passed.
Input image: input_image.bmp
Input data: 19638 random 24-bit integers
Input password: sex
Output image: output_image.bmp`);