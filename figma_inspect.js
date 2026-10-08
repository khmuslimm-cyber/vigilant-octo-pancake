const fs = require('fs');
const https = require('https');

const fileId = 'kCBVvWqGtvMfCebnBOAPrG';
const configData = fs.readFileSync('C:\\Users\\gisch\\.gemini\\config\\mcp_config.json', 'utf8');
const config = JSON.parse(configData);
const token = config.mcpServers.figma.env.FIGMA_ACCESS_TOKEN;

function fetchFigma(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: path,
      method: 'GET',
      headers: { 'X-Figma-Token': token }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function inspect() {
  console.log("Fetching Figma File overview...");
  const fileData = await fetchFigma(`/v1/files/${fileId}?depth=2`);
  
  if (fileData.document) {
    console.log("Pages in document:");
    fileData.document.children.forEach(page => {
      console.log(`Page: ${page.name} (id: ${page.id})`);
      (page.children || []).forEach(child => {
        console.log(`  - ${child.type}: ${child.name} (id: ${child.id})`);
      });
    });
  }

  // Also fetch styles / variables if available
  try {
    const styles = await fetchFigma(`/v1/files/${fileId}/styles`);
    console.log("\nStyles found:", JSON.stringify(styles.meta?.styles || [], null, 2));
  } catch (e) {
    console.log("Styles error:", e.message);
  }
}

inspect().catch(console.error);
