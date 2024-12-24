import "dotenv/config";

export const TASK_ID =
  process.env.TASK_ID || "C7qhKzyBsi4PL3bBPLXDWSG5qd9GKGPJLhZU2jvrsP4Z";
export const WEBPACKED_FILE_PATH =
  process.env.WEBPACKED_FILE_PATH || "../dist/main.js";

const envKeywords = process.env.TEST_KEYWORDS ?? "";

export const TEST_KEYWORDS = envKeywords
  ? envKeywords.split(",")
  : ["TEST", "SMART TESTING"];
