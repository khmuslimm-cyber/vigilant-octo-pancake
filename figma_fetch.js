const fs = require('fs');
const https = require('https');

const fileId = 'kCBVvWqGtvMfCebnBOAPrG';
const nodeId = '3330:166';

const configData = fs.readFileSync('C:\\Users\\gisch\\.gemini\\config\\mcp_config.json', 'utf8');
const config = JSON.parse(configData);
const token = config.mcpServers.figma.env.FIGMA_ACCESS_TOKEN;

const options = {
  hostname: 'api.figma.com',
  path: `/v1/files/${fileId}/nodes?ids=${nodeId}`,
  method: 'GET',
  headers: {
    'X-Figma-Token': token
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (res.statusCode !== 200) {
        console.error('Error:', json);
        return;
      }
      
      const nodeInfo = json.nodes[nodeId];
      if (nodeInfo) {
        const doc = nodeInfo.document;
        console.log(`Node Name: ${doc.name}`);
        console.log(`Node Type: ${doc.type}`);
        
        const children = doc.children || [];
        console.log(`Number of children: ${children.length}`);
        children.forEach(child => {
          console.log(` - ${child.type}: ${child.name}`);
        });
      } else {
        console.log('Node not found or no access.');
      }
    } catch (e) {
      console.error('Parse error', e);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
