function regexExtract(text) {
  console.log('Regex fallback active');
  const patterns = [ /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi, /Rs?\.?\s*(\d+(?:\.\d{2})?)/gi, /(\d+\.\d{2})/g, /(\d+)/g ];
  let maxAmt = 0;
  for (const pat of patterns) {
    let match;
    while (match = pat.exec(text)) {
      const num = parseFloat(match[1]?.replace(/,/g, '') || 0);
      if (num > maxAmt && num < 10000) maxAmt = num;
    }
  }
  console.log('Regex largest:', maxAmt);
  return maxAmt > 0 ? maxAmt : null;
}

module.exports = regexExtract;
