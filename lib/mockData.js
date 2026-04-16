// PRAGMA Fallback Mock Data
// Used to ensure the demo works flawlessly even if external APIs hit rate limits or go down

export const mockThreats = [
  {
    id: "th-01",
    timestamp: new Date().toISOString(),
    source_ip: "185.153.196.22",
    target_ip: "10.0.0.5",
    type: "Malware",
    severity: "critical",
    country: "Russia",
    countryCode: "RU",
    lat: 55.7558,
    lng: 37.6173,
    targetLat: 38.9072,
    targetLng: -77.0369,
    description: "Emotet C2 traffic detected",
  },
  {
    id: "th-02",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    source_ip: "45.134.144.112",
    target_ip: "10.0.0.12",
    type: "DDoS",
    severity: "high",
    country: "China",
    countryCode: "CN",
    lat: 39.9042,
    lng: 116.4074,
    targetLat: 37.7749,
    targetLng: -122.4194,
    description: "UDP Flood Attack - Web Server",
  },
  {
    id: "th-03",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    source_ip: "193.106.191.88",
    target_ip: "10.0.0.40",
    type: "Ransomware",
    severity: "critical",
    country: "Iran",
    countryCode: "IR",
    lat: 35.6892,
    lng: 51.3890,
    targetLat: 51.5074,
    targetLng: -0.1278,
    description: "LockBit 3.0 IOC detected in network traffic",
  },
  {
    id: "th-04",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    source_ip: "103.111.96.208",
    target_ip: "10.0.0.100",
    type: "Phishing",
    severity: "medium",
    country: "Brazil",
    countryCode: "BR",
    lat: -23.5505,
    lng: -46.6333,
    targetLat: 48.8566,
    targetLng: 2.3522,
    description: "Suspicious login attempt with newly registered domain",
  },
  {
    id: "th-05",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    source_ip: "89.248.165.10",
    target_ip: "10.0.0.2",
    type: "Scanner",
    severity: "low",
    country: "Netherlands",
    countryCode: "NL",
    lat: 52.3676,
    lng: 4.9041,
    targetLat: 40.7128,
    targetLng: -74.0060,
    description: "Mass port scanning detected (Mirai variant)",
  }
];

export const mockCVEs = [
  {
    id: "CVE-2023-4863",
    title: "WebP Heap Buffer Overflow",
    severity: "critical",
    score: 9.8,
    published: "2023-09-12T15:15:00.000Z",
    description: "Heap buffer overflow in libwebp in Google Chrome prior to 116.0.5845.187 and libwebp 1.3.2 allows a remote attacker to perform an out of bounds memory write via a crafted HTML page.",
    products: ["Chrome", "Edge", "Firefox", "libwebp"]
  },
  {
    id: "CVE-2024-3094",
    title: "XZ Utils Backdoor",
    severity: "critical",
    score: 10.0,
    published: "2024-03-29T19:15:00.000Z",
    description: "Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0. The malicious code modifies functions during the build process to intercept and modify tools that interact with the xz library, potentially allowing unauthorized access in SSHD.",
    products: ["xz-utils", "liblzma", "Debian", "Fedora", "Kali"]
  },
  {
    id: "CVE-2023-38545",
    title: "curl SOCKS5 Heap Buffer Overflow",
    severity: "high",
    score: 8.8,
    published: "2023-10-18T04:15:00.000Z",
    description: "A heap-based buffer overflow vulnerability exists in curl v7.69.0 to and including v8.3.0 in the SOCKS5 proxy handshake. If curl is prompted to pass the hostname to the SOCKS5 proxy, a crafted hostname can be used to overflow the heap buffer.",
    products: ["curl", "libcurl"]
  }
];

export const generateRandomThreat = () => {
  const types = ["Malware", "Phishing", "Scanner", "DDoS", "Brute Force", "SQLi", "C2"];
  const severities = ["critical", "high", "medium", "low"];
  const severityDistribution = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]; // Lean towards lower severity
  const severityIndex = severityDistribution[Math.floor(Math.random() * severityDistribution.length)];
  
  // Random coordinates for global distribution
  const srcLat = (Math.random() * 140) - 70; // -70 to 70 to avoid extreme poles
  const srcLng = (Math.random() * 360) - 180;
  const targetLat = (Math.random() * 120) - 60; // Focus targets more centrally
  const targetLng = (Math.random() * 360) - 180;

  return {
    id: `th-sim-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: new Date().toISOString(),
    source_ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    target_ip: `10.0.${Math.floor(Math.random()*5)}.${Math.floor(Math.random()*255)}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[severityIndex],
    country: "Unknown",
    countryCode: "UN",
    lat: srcLat,
    lng: srcLng,
    targetLat: targetLat,
    targetLng: targetLng,
    description: "(Simulated) Real-time incoming threat vector",
    isSimulated: true
  };
};

export const mockScanResults = {
  ip: "45.33.32.156",
  domain: "scanme.nmap.org",
  riskScore: 65,
  ports: [
    { port: 22, protocol: "tcp", service: "ssh", state: "open", version: "OpenSSH 6.6.1p1" },
    { port: 80, protocol: "tcp", service: "http", state: "open", version: "Apache httpd 2.4.7" },
    { port: 9929, protocol: "tcp", service: "nping-echo", state: "open", version: "Nping echo" },
    { port: 31337, protocol: "tcp", service: "tcpwrapped", state: "open", version: "" }
  ],
  tech: [
    { name: "Apache", type: "Web Server" },
    { name: "Ubuntu", type: "Operating System" },
    { name: "OpenSSH", type: "Remote Access" }
  ],
  ssl: {
    grade: "F",
    issuer: "Not Present",
    expiresOn: "Expired",
    protocol: "None"
  },
  headers: {
    "X-Frame-Options": "MISSING",
    "Strict-Transport-Security": "MISSING",
    "Content-Security-Policy": "MISSING",
    "Server": "Apache/2.4.7 (Ubuntu)"
  }
};
