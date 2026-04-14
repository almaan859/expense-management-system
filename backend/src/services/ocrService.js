const Tesseract = require("tesseract.js");

async function extractReceiptText(imagePath) {
  try {
    const result = await Tesseract.recognize(
      imagePath,
      "eng",
      { logger: m => console.log(m) }
    );
    return result.data.text;
  } catch (e) {
    console.log('Tesseract failed:', e.message);
    return '';
  }
}

function extractAmount(text) {
  if (!text) return null;

  console.log('OCR text sample:', text.substring(0, 400));

  // PRIORITY 1: Exact SUBTOTAL/TOTAL/Amount lines (Indian receipts)
  const totalPatterns = [
    /(?:subtotal|total\s*(?:amt|amount)?|net\s*(?:amt|amount)?|grand\s*total|bill\s*(?:amt|total)|final|paid|amount|rs?\.?\s*(?:tot|total))[:\s\-\*().,%₹$]+(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /sub[-]?total[:\s\-\*().,%₹$]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(?:subtot|tot|amt|bill)\.?\s*[:\-=₹$]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
  ];

  let bestMatch = null;
  let maxMatchValue = 0;

  for (const pattern of totalPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const candidate = parseFloat(match[1].replace(/[^\d.]/g, ''));
      console.log(`Found ${match[0].trim().substring(0,30)}... → ${candidate}`);
      if (candidate > maxMatchValue && candidate > 10 && candidate < 10000) {
        maxMatchValue = candidate;
        bestMatch = candidate;
      }
    }
  }

  if (bestMatch) {
    console.log('🎯 SELECTED SUBTOTAL MATCH:', bestMatch);
    return bestMatch;
  }

  // PRIORITY 2: Smart sum of line items (filter noise)
  const priceCandidates = text.match(/(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g) || [];
  const validPrices = priceCandidates
    .map(p => parseFloat(p.replace(/[^\d.,]/g, '').replace(',', '')))
    .filter(p => p > 10 && p < 2000)  // Skip tax % noise <10
    .sort((a,b) => b - a);

  if (validPrices.length >= 2) {
    const sum = validPrices.slice(0, 10).reduce((s, p) => s + p, 0);  // Top 10 largest
    console.log('Summed line items:', validPrices.slice(0,10), 'Sum:', sum);
    if (sum > 20 && sum < 10000) {
      return sum;
    }
  }

  // PRIORITY 3: Largest reasonable number
  const fallback = validPrices[0];
  console.log('Fallback largest:', fallback);
  return fallback || null;
}

module.exports = {
  extractReceiptText,
  extractAmount
};
