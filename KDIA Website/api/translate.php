<?php
header('Content-Type: application/json');

require_once __DIR__ . '/dictionary.php';

// Helper function to call public Google Translate endpoint
function fetchTranslation($text, $source, $target) {
    try {
        $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" . urlencode($source) . "&tl=" . urlencode($target) . "&dt=t&q=" . urlencode($text);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200 || !$response) {
            throw new Exception("Google Translate status: " . $httpCode);
        }
        
        $data = json_decode($response, true);
        if ($data && isset($data[0]) && is_array($data[0])) {
            $parts = [];
            foreach ($data[0] as $item) {
                if (isset($item[0])) {
                    $parts[] = $item[0];
                }
            }
            return implode('', $parts);
        }
        return $text;
    } catch (Exception $e) {
        error_log('Google Translate error: ' . $e->getMessage());
        throw $e;
    }
}

// Function to call Devnagri Order API (non-blocking simulation)
function placeDevnagriOrder($texts, $source, $target) {
    $apiKey = getenv('DEVNAGRI_API_KEY');
    if (!$apiKey) {
        return null;
    }
    
    try {
        $dataObject = [];
        foreach ($texts as $index => $text) {
            $dataObject["text_" . $index] = $text;
        }
        
        $payload = [
            "api_key" => $apiKey,
            "project_name" => "KDIA Website Translation",
            "industry" => "general",
            "source_language" => $source,
            "target_language" => [$target],
            "segmentation" => true,
            "data" => [$dataObject]
        ];
        
        $ch = curl_init("https://app.devnagri.com/api/order/json");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2); // Short timeout to avoid blocking the user
        
        curl_exec($ch);
        curl_close($ch);
    } catch (Exception $e) {
        error_log("Failed to place Devnagri translation order: " . $e->getMessage());
    }
}

// Read JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$texts = isset($input['texts']) ? $input['texts'] : null;
$source = isset($input['source']) ? $input['source'] : 'en';
$target = isset($input['target']) ? $input['target'] : 'hi';

if (!is_array($texts) || empty($texts)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid texts array"]);
    exit;
}

// 1. Devnagri order (asynchronous in background)
placeDevnagriOrder($texts, $source, $target);

// 2. Perform translation using dictionary lookup + Google translation fallback
$results = [];
$missingTexts = [];

foreach ($texts as $text) {
    $trimmed = trim($text);
    if (empty($trimmed)) {
        $results[$text] = $text;
        continue;
    }
    
    // Check static dictionary
    $dictValue = null;
    if ($source === 'en' && $target === 'hi') {
        if (isset($staticDictionary[$trimmed])) {
            $dictValue = $staticDictionary[$trimmed];
        }
    } else if ($source === 'hi' && $target === 'en') {
        // Reverse lookup
        $foundKey = array_search($trimmed, $staticDictionary);
        if ($foundKey !== false) {
            $dictValue = $foundKey;
        }
    }
    
    if ($dictValue !== null) {
        $results[$text] = $dictValue;
    } else {
        $missingTexts[] = $trimmed;
    }
}

if (empty($missingTexts)) {
    echo json_encode(["translations" => $results]);
    exit;
}

// Fetch missing texts from the Google Translate fallback in batches
$delimiter = " ||| ";
$batchSize = 25;
$missingTextsCount = count($missingTexts);

for ($i = 0; $i < $missingTextsCount; $i += $batchSize) {
    $batch = array_slice($missingTexts, $i, $batchSize);
    $combinedText = implode($delimiter, $batch);
    
    try {
        $translatedCombined = fetchTranslation($combinedText, $source, $target);
        // Split back using regex or simple string split
        $translatedParts = preg_split('/\s*\|\|\|\s*/', $translatedCombined);
        
        foreach ($batch as $j => $orig) {
            $trans = isset($translatedParts[$j]) ? trim($translatedParts[$j]) : $orig;
            
            // Clean up translation text (remove Hindi specific punctuation/spaces at ends)
            $trans = preg_replace('/^[\s\|।\?\x{0964}]+|[\s\|।\?\x{0964}]+$/u', '', $trans);
            
            // Map back to all occurrences in texts array
            foreach ($texts as $text) {
                if (trim($text) === $orig) {
                    $results[$text] = $trans;
                }
            }
        }
    } catch (Exception $err) {
        error_log("Batch translation failed, falling back to single translation: " . $err->getMessage());
        // Individual fallback
        foreach ($batch as $orig) {
            try {
                $trans = fetchTranslation($orig, $source, $target);
                foreach ($texts as $text) {
                    if (trim($text) === $orig) {
                        $results[$text] = trim($trans);
                    }
                }
            } catch (Exception $singleErr) {
                foreach ($texts as $text) {
                    if (trim($text) === $orig) {
                        $results[$text] = $orig;
                    }
                }
            }
        }
    }
}

echo json_encode(["translations" => $results]);
