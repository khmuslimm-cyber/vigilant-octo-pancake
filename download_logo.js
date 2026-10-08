const https = require('https');
const fs = require('fs');

const url = 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/819cf66d-523d-4334-9b8e-6c55ff1c8414';
const dest = 'assets/logo.png';

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Logo downloaded to ' + dest);
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error:', err.message);
});
