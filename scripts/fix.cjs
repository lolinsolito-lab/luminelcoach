const fs = require('fs');

let txt = fs.readFileSync('public/luminel-landing.html', 'utf8');

const map = {
  'â€”': '—',
  'Ã¨': 'è',
  'giÃ ': 'già',
  'piÃ¹': 'più',
  'costerÃ ': 'costerà',
  'perchÃ©': 'perché',
  'funzionalitÃ ': 'funzionalità',
  'nÃ©': 'né',
  'profonditÃ ': 'profondità',
  'sarÃ ': 'sarà',
  'realtÃ ': 'realtà',
  'novitÃ ': 'novità',
  'opportunitÃ ': 'opportunità',
  'DÃ ': 'Dà',
  'Luminel â€” Coach': 'Luminel — Coach',
  'Â·': '·',
  'ðŸœ”': '🜔',
  'â—ˆ': '◈',
  'â™›': '♛',
  'â™ª': '♪',
  'â†’': '→',
  'â‚¬': '€',
  'Âª': 'ª',
  'Ã²': 'ò',
  'Ã¬': 'ì',
  'Ã¹': 'ù',
  'Ã ': 'à',
  'Ã©': 'é'
};

for (const [bad, good] of Object.entries(map)) {
  txt = txt.split(bad).join(good);
}

// Aggiungiamo la firma di Insolito
if (!txt.includes('console.log("%c')) {
  txt = txt.replace('</script>', `
// SIGNATURE
console.log("%cLuminel Coach V3 \\n%cMade with â™¥ by Insolito", "color: #C9A84C; font-family: 'Cinzel', serif; font-size: 20px; font-weight: 600;", "color: #6A6560; font-family: 'DM Sans', sans-serif; font-size: 12px;");
</script>`);
}

// Ripariamo il cuore che potrebbe rompersi
txt = txt.replace('â™¥', '♥');

fs.writeFileSync('public/luminel-landing.html', txt, 'utf8');
console.log('Fatto!');
