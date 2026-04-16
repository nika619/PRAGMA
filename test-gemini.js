import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const input = "185.153.196.22";
    const type = "IP Address";
    
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

    console.log("Calling model...");
    const result = await model.generateContent(prompt);
    console.log("Success! Response:");
    console.log(result.response.text());
  } catch (err) {
    console.error("Error details:", err);
  }
}
test();
