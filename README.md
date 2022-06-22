# PENIS
## Get Ready to Enjoy PENIS
PENIS (Picture-based Encrypted Non-visually-detectable Integrated Storage) is a library for encrypting and storing an arbitrary sized arrays of 24-bit numbers in an image. These 24-bit numbers are large enough to store e621 post IDs, the intended use of this library. PENIS is a proof of concept for simple JS steganography using Windows 3.x bitmaps (for a reasonably sized storage, we recomand at least 8000 pixels).

PENIS is:
* Encrypted (CAMELLIA-256-OFB, key derived using scrypt)
* Discreet (uses LSB steganography, cannot be distinguished by the human eye)
* Lightweight (only around 94 pixels of overhead with 8 pixels used per integer)
* Easy to use (extremely easy API)
* JavaScript (elegant by definition)
* A meme (simply put)

## How Can I Use This PENIS?
PENIS is not on NPM, so you'll have to thrust `index.js` into your codebase. Don't worry, it's public domain, so you don't have to worry about licensing! You'll also need to install `bmp-js` in the codebase you're using PENIS in. PENIS provides two functions:
* `fromBmp(bytes: Buffer, password: String | Buffer): Array` - Retrieves and decrypts an array of 24-bit integers from a BMP. `bytes` is the BMP and `password` is the password.
* `toBmp(ints: Array, bytes: Buffer, password: String | Buffer): Buffer` - Encrypts and stores an array of 24-bit integers into a BMP, returning the BMP as a result. `ints` is the array of integers, `bytes` is the existing BMP, and `password` is the password.

**PLEASE NOTE THAT PENIS IS ONLY COMPATIBLE WITH 24-BIT WINDOWS 3.X BMPs! ANY OTHER BMP FORMAT WILL NOT WORK! IF YOU ARE USING IMAGEMAGICK TO CONVERT AN IMAGE TO A BMP, SET THE FILE EXTENSION TO BMP3.**

If needed, the maximum amount of 24-bit integers that PENIS can store in an image is about `(totalPixels * 3 - 280) / 24`.

## Will There Be a Paper on PENIS?
Yes! Just wait a few months.

## Demo/Test
For a test, clone this repo, run `npm i`, then run `npm test`.

Image before PENIS:

![Image before PENIS](test_image.png)

Image after PENIS (19638 random 24-bit integers):

![Image after PENIS](output_image.png)

Please refrain from using the test image outside of PENIS without my permission. Thank you!