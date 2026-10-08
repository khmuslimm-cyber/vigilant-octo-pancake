const https = require('https');
const fs = require('fs');

const logos = {
  'lm_png.png': 'https://s3-alpha-sig.figma.com/img/3e75/6fad/9eaa0ef232a7e27b9930a834802a0877?Expires=1791763200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=h60gLE5Q7dNNZmKNBML42fVWRiOVvYgU6PqKOKtfMXh9bkMDSkdzEmbUTqbMVnJ2rk4hoqO6cYxORo7G9lb4zPdg3ZkP2iNOeqifQBS7wBuOky5d-UncTl7TpwXsH330pBn4OI33T9l7L93K01NZMDmU7H8VdqpPDWhdP30rtLdiDUPg0k5vQU6YSHAaL5tVV-8Bj-tigNumy3yrQkYoRCm~1kgaYvhDqiVw629~1y5x~Ikj3M3lwPUUccC57jtKfH00CipmXBInxw3mkiiSetzYFaoJwR4~KhDlKfbmc4r0xj2pWqiHEztNMV7YHgcQ2JHRT1iW26iaq9t1n0ny5A__',
  'schneider_png.png': 'https://s3-alpha-sig.figma.com/img/8171/005e/05e557012443d73ab0f6baf2a6cf4a3f?Expires=1791763200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JESoHR5T7Z0qk3J4BnKgJ3BHI1jcuwyBA0ohIcgsn2rkuRYE-UTs9MIk8EQ-0koWPX~3bzCbvSg~X3jcw-VENOGdoj~ZwYHc3Qd1t7GGMGhe3TaM8Z1qBxMI4agu4ZhyHslVX1wD13L1Gg-zQnDxtzN4zqYN~3Oh7xECDhmpgXA88~mYDJMUtcpqA8FYzTK2PnE4JIsCpMG8q7-u5xkpcWLOR2x1O6SItVOxmH4iJ9Ytr6DP3HufnjQknaenZsNZbAk4AypU-GXhbEX~Mb6rK-EpX4YgOLZBhZpXIfvpReb3wAoWKdlAa~lnrV7Or3hdsX5scqGXSCVZtto15rnWMg__',
  'legrand_png.png': 'https://s3-alpha-sig.figma.com/img/48f8/f69f/abb9c4a51c4325b370e39f70c1ed485d?Expires=1791763200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=g525IeTSAa~ZJewVvFXMZe1Jvd-UR8wy3Zn8WFFkuF4Ns9fx-heGJx1w7E7yX-a5adBUySBp-o-NK4gZ4cmM3JlS39FAmAbywaCMY1LqWDCThQQhHAlG147tG7OwlMdLuFUl6Xqa43pMSGi8obwtXgZD57U4myl6~tlh94H9qA-GRaLkoEDLZVSwRiowEo2JloAsX9AlJRsXsLksNQxOODACHrnFS2Ly8pNooLcZEbwPmjuJFe5zvfCCQBC6nSHfof2ATRBmphl7XKZzmFUWKSXx9MWzyPETnY9-St-YEALyKqebf-09B4pSwaCHWkwegrV5q89--pTJNBgbN6xrFA__'
};

let downloaded = 0;
const total = Object.keys(logos).length;

for (const [filename, url] of Object.entries(logos)) {
  const dest = `assets/${filename}`;
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      downloaded++;
      console.log(`Downloaded: ${dest} (${downloaded}/${total})`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
}
