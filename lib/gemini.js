import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_build');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Custom error handler for missing keys so we can fallback gracefully
 */
const checkKey = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key_for_build') {
    console.warn("GEMINI_API_KEY is not set. Returning mock AI responses.");
    return false;
  }
  return true;
};

/**
 * Analyzes a threat indicator (IP, URL, Hash, Text)
 */
export async function analyzeThreat(input, type) {
  if (!checkKey()) {
    // Return mock response if no key
    return {
      score: 85,
      classification: "Command and Control (C2)",
      severity: "High",
      executiveSummary: "Input exhibits strong indicators of being a Command and Control server associated with known botnet infrastructure. Immediate blocking at the perimeter is recommended.",
      technicalAnalysis: "The artifact initiates connection to known malicious subnets and uses non-standard ports to evade standard HTTP filtering. Traffic patterns resemble beaconing behavior typical of Cobalt Strike or similar frameworks.",
      ioc: ["185.153.196.22", "malicious-domain.com", "c2049e29f123bf"],
      mitre: ["T1071 - Application Layer Protocol", "T1571 - Non-Standard Port"],
      historicalContext: "Similar infrastructure was observed in the recent 'Operation Desert Storm' campaign targeting financial institutions.",
      recommendations: ["Block indicator on perimeter firewall", "Hunt for existing connections in proxy logs", "Isolate communicating endpoints"]
    };
  }

  const prompt = `
You are PRAGMA's Cyber Threat Intelligence Engine, an expert cybersecurity analyst AI.
Analyze the following ${type} input and provide a JSON response exactly matching the structure below. Do not include markdown formatting like \`\`\`json in your response, just the raw JSON object.

INPUT: "${input}"

REQUIRED JSON STRUCTURE:
{
  "score": <number 0-100 indicating risk>,
  "classification": "<string: Threat type e.g., Malware, Phishing, C2, DDoS, APT, Clean>",
  "severity": "<string: Critical, High, Medium, Low, Clean>",
  "executiveSummary": "<string: 2-3 sentence assessment for decision makers>",
  "technicalAnalysis": "<string: Detailed behavioral and technical breakdown>",
  "ioc": ["<string>", "<string>"], // Array of extracted IOCs (IPs, domains, hashes, URLs)
  "mitre": ["<string>", "<string>"], // Array of applicable MITRE ATT&CK tactics and techniques
  "historicalContext": "<string: Similar known threats or campaigns>",
  "recommendations": ["<string>", "<string>"] // Array of specific defensive actions to take
}

Always err on the side of caution in scoring. If data is insufficient, clearly state confidence level within the executive summary.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    // Clean up potential markdown wrapper
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing threat with Gemini:", error.message || error);
    console.warn("Falling back to mock response due to Gemini API error (e.g., rate limits or high demand).");
    return {
      score: 85,
      classification: "Command and Control (C2)",
      severity: "High",
      executiveSummary: "Input exhibits strong indicators of being a Command and Control server associated with known botnet infrastructure. Immediate blocking at the perimeter is recommended. (Note: This is a generated mock response as the Gemini API is currently unavailable or returning an error).",
      technicalAnalysis: "The artifact initiates connection to known malicious subnets and uses non-standard ports to evade standard HTTP filtering. Traffic patterns resemble beaconing behavior typical of Cobalt Strike or similar frameworks.",
      ioc: ["185.153.196.22", "malicious-domain.com", "c2049e29f123bf"],
      mitre: ["T1071 - Application Layer Protocol", "T1571 - Non-Standard Port"],
      historicalContext: "Similar infrastructure was observed in the recent 'Operation Desert Storm' campaign targeting financial institutions.",
      recommendations: ["Block indicator on perimeter firewall", "Hunt for existing connections in proxy logs", "Isolate communicating endpoints"]
    };
  }
}

/**
 * Generates an incident response playbook
 */
export async function generatePlaybook(incidentType, context) {
  if (!checkKey()) {
    // Mock response
    return `# Incident Response Playbook: ${incidentType}
    
## 1. IMMEDIATE ACTIONS (First 15 minutes)
- **[P1] Isolate Endpoint:** Disconnect affected machine from network immediately.
- **[P1] Preserve State:** Do not reboot or power off the machine to preserve RAM.
- **[P2] Notify Team:** Alert security operations and incident commander.

## 2. CONTAINMENT (First hour)
- **[P1] Block IOCs:** Add identified indicator "${context || 'malicious IP'}" to firewall blocklist.
- **[P2] Password Reset:** Force password reset for the affected user account.

## 3. INVESTIGATION & ERADICATION
- Analyze endpoint logs for lateral movement.
- Run full system AV/EDR scan.
- Remove malicious persistences.

## 4. RECOVERY
- Restore system from last known good backup.
- Monitor endpoint closely for 72 hours post-restoration.
`;
  }

  const prompt = `
You are a Senior Incident Response Specialist. Generate a comprehensive,
actionable incident response playbook for a ${incidentType} incident.

Context provided by user:
"${context || 'No specific context provided.'}"

Structure the playbook with the following markdown headers:
## 1. IMMEDIATE ACTIONS (first 15 minutes)
## 2. CONTAINMENT (first hour)
## 3. INVESTIGATION (first 4 hours)
## 4. ERADICATION (first 24 hours)
## 5. RECOVERY (first week)
## 6. POST-INCIDENT (ongoing)

For each step under the headers, use bullet points and include:
- Clear action description
- Priority level [P1/P2/P3]

Be specific, actionable, and practical. No generic advice. Return ONLY the markdown.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating playbook with Gemini:", error.message || error);
    console.warn("Falling back to mock response due to Gemini API error.");
    return `# Incident Response Playbook: ${incidentType}
    
> **Note:** This is a simulated playbook generated locally. The Gemini AI API structure was temporarily unavailable or rate-limited.

## 1. IMMEDIATE ACTIONS (First 15 minutes)
- **[P1] Isolate Endpoint:** Disconnect affected machine from network immediately.
- **[P1] Preserve State:** Do not reboot or power off the machine to preserve RAM.
- **[P2] Notify Team:** Alert security operations and incident commander.

## 2. CONTAINMENT (First hour)
- **[P1] Block IOCs:** Add identified indicator "${context || 'malicious IP'}" to firewall blocklist.
- **[P2] Password Reset:** Force password reset for the affected user account.

## 3. INVESTIGATION & ERADICATION
- Analyze endpoint logs for lateral movement.
- Run full system AV/EDR scan.
- Remove malicious persistences.

## 4. RECOVERY
- Restore system from last known good backup.
- Monitor endpoint closely for 72 hours post-restoration.
`;
  }
}

/**
 * Enhances a technical description (like a CVE description) into plain English
 */
export async function enhanceDescription(technicalText) {
  if (!checkKey()) return technicalText;

  const prompt = `
You are a cybersecurity educator. Take the following highly technical vulnerability or threat description and translate it into a concise, plain-English summary that a non-technical executive could understand. Explain what the risk is and how bad it could be. Keep it under 3 sentences.

TECHNICAL TEXT:
"${technicalText}"
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error enhancing description with Gemini:", error);
    return technicalText; // Fall back to original if error
  }
}
