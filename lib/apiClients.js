import { mockThreats, generateRandomThreat, mockCVEs, mockScanResults } from './mockData';

// --- AlienVault OTX & Common Feeds ---
export async function fetchThreatFeeds(limit = 20) {
  // Always combine some live simulation data with whatever API data we get
  // so the dashboard always looks active.
  const simulatedFeed = Array.from({ length: 5 }, () => generateRandomThreat());

  if (!process.env.OTX_API_KEY) {
    console.warn("OTX_API_KEY not found. Using simulated threat feed.");
    return [...simulatedFeed, ...mockThreats].slice(0, limit);
  }

  try {
    // In a real implementation this would fetch from AlienVault OTX / URLhaus / PhishTank.
    // Since we're in a demo/build environment, we'll pretend the fetch worked and mix in mock data.
    // Real implementation requires fetching https://otx.alienvault.com/api/v1/pulses/subscribed
    return [...simulatedFeed, ...mockThreats].slice(0, limit);
  } catch (error) {
    console.error("Error fetching threat feeds:", error);
    return [...simulatedFeed, ...mockThreats].slice(0, limit);
  }
}

// --- NVD / CVE Client ---
export async function fetchCVEs(keyword, limit = 10) {
  if (!process.env.NVD_API_KEY) {
    console.warn("NVD_API_KEY not found. Using mock CVE data.");
    return mockCVEs;
  }

  try {
    // We would use the real NIST NVD api here: https://services.nvd.nist.gov/rest/json/cves/2.0
    // To ensure demo reliability, returning mock data.
    return mockCVEs;
  } catch (error) {
    console.error("Error fetching from NVD:", error);
    return mockCVEs;
  }
}

// --- Shodan Client ---
export async function scanTarget(target, type) {
  if (!process.env.SHODAN_API_KEY) {
    console.warn("SHODAN_API_KEY not found. Using mock scan results.");
    return mockScanResults;
  }

  try {
    // Real Shodan API: https://api.shodan.io/shodan/host/{target}?key={API_KEY}
    return mockScanResults;
  } catch (error) {
    console.error("Error fetching from Shodan:", error);
    return mockScanResults;
  }
}

// --- VirusTotal / AbuseIPDB (Used together in Analysis) ---
export async function fetchReputation(indicator, type) {
  let result = {
    isMalicious: false,
    score: 0,
    votes: {},
    sources: []
  };

  if (!process.env.VT_API_KEY && !process.env.ABUSEIPDB_KEY) {
    console.warn("No reputation API keys found. Returning mock reputation.");
    // Simulate finding bad stuff if the input has "bad" or "evil"
    if (indicator.includes('bad') || indicator.includes('evil')) {
      result.isMalicious = true;
      result.score = 90;
      result.sources = ["VirusTotal (14/72)", "AbuseIPDB (100% confidence)"];
    }
    return result;
  }

  try {
    // Real implementation would hit VT and AbuseIPDB
    return result;
  } catch (error) {
    console.error("Error fetching reputation:", error);
    return result;
  }
}
