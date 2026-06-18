const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets for the portal
app.use('/land-owner-portal', express.static(path.join(__dirname, 'land-owner-portal')));

// Serve root static assets (index.html, about.html, etc.) and support extensionless routes
app.use(express.static(path.join(__dirname, '.'), { extensions: ['html'] }));

// API routes (placeholder modules)
app.use('/api/auth', require('./land-owner-portal/api/auth'));
app.use('/api/land', require('./land-owner-portal/api/land'));
app.use('/api/documents', require('./land-owner-portal/api/documents'));
app.use('/api/notifications', require('./land-owner-portal/api/notifications'));

// --- Translation Dictionary and Service ---
const staticDictionary = {
  // Navigation
  "Home": "मुख्य पृष्ठ",
  "Company & Energy Solutions": "कंपनी और ऊर्जा समाधान",
  "Govt. Schemes & Policies": "सरकारी योजनाएं और नीतियां",
  "Re-Culator": "री-क्यूलेटर",
  "Re-Culator +": "री-क्यूलेटर +",
  "Contact Us": "हमसे संपर्क करें",
  "Policies": "नीतियां",
  "Schemes": "योजनाएं",
  "Guidelines": "दिशानिर्देश",
  "Tariff Orders": "टैरिफ आदेश",
  
  // Titles & Headings
  "Powering Tomorrow": "कल को ऊर्जा देना",
  "with Clean Energy": "स्वच्छ ऊर्जा के साथ",
  "Explore Our Solutions": "हमारे समाधानों की खोज करें",
  "Apply for Solar Subscription": "सौर सदस्यता के लिए आवेदन करें",
  "Professional": "पेशेवर",
  "Ownership": "स्वामित्व",
  "Standards": "मानक",
  "Infrastructure Excellence for": "बुनियादी ढांचा उत्कृष्टता",
  "Long-Term Reliability.": "दीर्घकालिक विश्वसनीयता।",
  "Clean Ownership": "स्वच्छ स्वामित्व",
  "Long-Term Stability": "दीर्घकालिक स्थिरता",
  "Sustainable Growth": "सतत विकास",
  
  // Land Information Section
  "Land Verification Form": "भूमि सत्यापन फॉर्म",
  "Number of Owners": "मालिकों की संख्या",
  "State": "राज्य",
  "District": "जिला",
  "Tehsil": "तहसील",
  "Village": "गाँव",
  "Khata Number": "खाता संख्या",
  "Khasra Number": "खसरा संख्या",
  "Area Unit": "क्षेत्रफल इकाई",
  "Land Area": "भूमि क्षेत्रफल",
  "Land Type": "भूमि प्रकार",
  "Google Maps Location Picker": "गूगल मैप्स स्थान चयनकर्ता",
  "Co-owner NOC Upload Field": "सह-मालिक एनओसी अपलोड फ़ील्ड",
  "Submit": "जमा करें",
  "Reset": "रीसेट करें",
  "Submit Application": "आवेदन जमा करें",
  
  // Footer
  "Quick Links": "त्वरित लिंक",
  "Legal": "कानूनी",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms of Service": "सेवा की शर्तें",
  "All Rights Reserved.": "सर्वाधिकार सुरक्षित।",
  "KDIA RE PARK": "केडीआईए री पार्क"
};

// Helper function to call public Google Translate endpoint as live fallback
async function fetchTranslation(text, source, target) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Translate status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data[0]) {
      return data[0].map(item => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error('Google Translate error:', error);
    throw error;
  }
}

// Function to call Devnagri Order API asynchronously in the background
async function placeDevnagriOrder(texts, source, target) {
  const apiKey = process.env.DEVNAGRI_API_KEY;
  if (!apiKey) {
    console.log("DEVNAGRI_API_KEY not set. Skipping Devnagri Order placement.");
    return null;
  }
  
  try {
    const dataObject = {};
    texts.forEach((text, index) => {
      dataObject[`text_${index}`] = text;
    });
    
    const payload = {
      api_key: apiKey,
      project_name: "KDIA Website Translation",
      industry: "general",
      source_language: source,
      target_language: [target],
      segmentation: true,
      data: [dataObject]
    };
    
    console.log("Placing translation order to Devnagri Translation API...");
    const response = await fetch("https://app.devnagri.com/api/order/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Devnagri status: ${response.status}`);
    }
    
    const resData = await response.json();
    console.log("Devnagri Translation Order placed successfully:", resData);
    return resData;
  } catch (error) {
    console.error("Failed to place Devnagri translation order:", error.message);
    return null;
  }
}

// REST Proxy Route for Translation
app.post('/api/translate', async (req, res) => {
  const { texts, source = 'en', target = 'hi' } = req.body;
  
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: "Invalid texts array" });
  }
  
  console.log(`Translation requested: ${texts.length} items from '${source}' to '${target}'`);
  
  // 1. Submit order to Devnagri API asynchronously in the background (if API key is present)
  placeDevnagriOrder(texts, source, target);
  
  // 2. Perform translation using dictionary lookup + live Google neural translation fallback
  const results = {};
  const missingTexts = [];
  
  for (const text of texts) {
    const trimmed = text.trim();
    if (!trimmed) {
      results[text] = text;
      continue;
    }
    
    // Check static dictionary first
    let dictValue = null;
    if (source === 'en' && target === 'hi') {
      dictValue = staticDictionary[trimmed];
    } else if (source === 'hi' && target === 'en') {
      // Reverse lookup
      dictValue = Object.keys(staticDictionary).find(key => staticDictionary[key] === trimmed);
    }
    
    if (dictValue) {
      results[text] = dictValue;
    } else {
      missingTexts.push(trimmed);
    }
  }
  
  if (missingTexts.length === 0) {
    return res.json({ translations: results });
  }
  
  // Fetch missing texts from the neural translation fallback in batches
  const delimiter = " ||| ";
  const batchSize = 25;
  
  for (let i = 0; i < missingTexts.length; i += batchSize) {
    const batch = missingTexts.slice(i, i + batchSize);
    const combinedText = batch.join(delimiter);
    try {
      const translatedCombined = await fetchTranslation(combinedText, source, target);
      const translatedParts = translatedCombined.split(/\|\|\|/);
      
      for (let j = 0; j < batch.length; j++) {
        const orig = batch[j];
        let trans = translatedParts[j] ? translatedParts[j].trim() : orig;
        
        // Clean up translation text
        trans = trans.replace(/^[\s\|।\u0964\?]+|[\s\|।\u0964\?]+$/g, '');
        
        // Map back to all occurrences in texts array
        for (const text of texts) {
          if (text.trim() === orig) {
            results[text] = trans;
          }
        }
      }
    } catch (err) {
      console.error(`Batch translation failed for range ${i} to ${i + batchSize}, falling back to single translation:`, err.message);
      // Individual fallback
      for (const orig of batch) {
        try {
          const trans = await fetchTranslation(orig, source, target);
          for (const text of texts) {
            if (text.trim() === orig) {
              results[text] = trans.trim();
            }
          }
        } catch (singleErr) {
          for (const text of texts) {
            if (text.trim() === orig) {
              results[text] = orig;
            }
          }
        }
      }
    }
  }
  
  return res.json({ translations: results });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
