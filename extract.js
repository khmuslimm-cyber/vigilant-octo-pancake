const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('figma_dump.json', 'utf8'));
const page = dump.nodes['3476:1230'].document;

// Find specific nodes and dump their full properties
function findById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (const c of node.children) {
      const found = findById(c, id);
      if (found) return found;
    }
  }
  return null;
}

function findByName(node, name, results = []) {
  if (!node) return results;
  if (node.name === name) results.push(node);
  if (node.children) for (const c of node.children) findByName(c, name, results);
  return results;
}

// Get all mainbutton instances (the "En savoir plus" buttons)
const mainbuttons = findByName(page, 'mainbutton');
console.log('=== MAINBUTTON (En savoir plus) DETAILS ===');
mainbuttons.forEach((btn, i) => {
  console.log(`\nButton ${i + 1} (id: ${btn.id}):`);
  console.log('  fills:', JSON.stringify(btn.fills, null, 4));
  console.log('  strokes:', JSON.stringify(btn.strokes, null, 4));
  console.log('  opacity:', btn.opacity);
  console.log('  cornerRadius:', btn.cornerRadius);
  console.log('  absoluteBoundingBox:', JSON.stringify(btn.absoluteBoundingBox));
  if (btn.strokeWeight) console.log('  strokeWeight:', btn.strokeWeight);
  if (btn.strokeAlign) console.log('  strokeAlign:', btn.strokeAlign);
  if (btn.effects) console.log('  effects:', JSON.stringify(btn.effects));
});

// Get CTA button "Demander un devis gratuit"
const frame2 = findByName(page, 'Frame 2');
console.log('\n=== CTA BUTTON (Demander un devis) DETAILS ===');
frame2.forEach((btn, i) => {
  console.log(`\nCTA ${i + 1} (id: ${btn.id}):`);
  console.log('  absoluteBoundingBox:', JSON.stringify(btn.absoluteBoundingBox));
  console.log('  cornerRadius:', btn.cornerRadius);
  console.log('  fills:', JSON.stringify(btn.fills));
});

// Hero section and text positions
console.log('\n=== HERO LAYOUT POSITIONS (relative to hero frame) ===');
const hero = findByName(page, 'Landing Page')[0];
if (hero) {
  const heroBox = hero.absoluteBoundingBox;
  console.log('Hero frame:', JSON.stringify(heroBox));
  
  // Title groups
  const titleGroups = findByName(page, 'Titre + description');
  titleGroups.forEach((tg, i) => {
    const box = tg.absoluteBoundingBox;
    console.log(`\nTitle group ${i + 1} (id: ${tg.id}):`);
    console.log(`  Absolute: x=${box.x} y=${box.y}`);
    console.log(`  Relative to hero: x=${Math.round(box.x - heroBox.x)} y=${Math.round(box.y - heroBox.y)}`);
    if (tg.children) {
      tg.children.forEach(c => {
        const cb = c.absoluteBoundingBox;
        console.log(`  Child "${c.name}": relative x=${Math.round(cb.x - heroBox.x)} y=${Math.round(cb.y - heroBox.y)} [${cb.width}x${cb.height}]`);
        if (c.characters) console.log(`    text: "${c.characters}"`);
      });
    }
  });
  
  // Buttons relative to hero
  mainbuttons.forEach((btn, i) => {
    const box = btn.absoluteBoundingBox;
    console.log(`\nEn savoir plus button ${i + 1}: relative x=${Math.round(box.x - heroBox.x)} y=${Math.round(box.y - heroBox.y)}`);
  });
  
  frame2.forEach((btn, i) => {
    const box = btn.absoluteBoundingBox;
    console.log(`CTA button: relative x=${Math.round(box.x - heroBox.x)} y=${Math.round(box.y - heroBox.y)}`);
  });
}

// Partenariats position relative to hero
const partenariats = findByName(page, 'Partenariats')[0];
if (partenariats && hero) {
  const pBox = partenariats.absoluteBoundingBox;
  const hBox = hero.absoluteBoundingBox;
  console.log(`\n=== GAP BETWEEN HERO AND PARTENARIATS ===`);
  console.log(`Hero bottom: ${hBox.y + hBox.height}`);
  console.log(`Partenariats top: ${pBox.y}`);
  console.log(`Gap: ${pBox.y - (hBox.y + hBox.height)}px`);
}
