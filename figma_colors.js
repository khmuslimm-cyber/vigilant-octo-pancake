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

function rgbToHex(r, g, b, a = 1) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractColorsAndTexts(node, colors = new Set(), texts = [], level = 0) {
  if (!node) return { colors, texts };

  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach(fill => {
      if (fill.type === 'SOLID' && fill.color && fill.visible !== false) {
        colors.add(rgbToHex(fill.color.r, fill.color.g, fill.color.b));
      }
    });
  }

  if (node.type === 'TEXT' && node.characters) {
    texts.push({
      name: node.name,
      text: node.characters,
      style: node.style ? {
        fontFamily: node.style.fontFamily,
        fontWeight: node.style.fontWeight,
        fontSize: node.style.fontSize
      } : null
    });
  }

  if (node.children) {
    node.children.forEach(child => extractColorsAndTexts(child, colors, texts, level + 1));
  }

  return { colors, texts };
}

async function extractDetails() {
  const ids = ['3316:152', '3330:73', '3330:167', '3476:1230', '3326:1205'];
  const data = await fetchFigma(`/v1/files/${fileId}/nodes?ids=${ids.join(',')}`);

  for (const id of ids) {
    const node = data.nodes?.[id]?.document;
    if (node) {
      const { colors, texts } = extractColorsAndTexts(node);
      console.log(`\n============================`);
      console.log(`Node: ${node.name} (${node.type}) ID: ${id}`);
      console.log(`Colors found:`, Array.from(colors));
      console.log(`Text count: ${texts.length}`);
      console.log(`Sample texts (first 10):`);
      texts.slice(0, 10).forEach(t => console.log(`  - [${t.name}]: "${t.text.replace(/\n/g, ' ')}" (${t.style?.fontFamily || ''} ${t.style?.fontSize || ''}px)`));
    }
  }
}

extractDetails().catch(console.error);
