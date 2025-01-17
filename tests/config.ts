import "dotenv/config";

export const TASK_ID =
  process.env.TASK_ID || "3ioJZbeWaSfwDuQkdDAh6MFkFkxgXM4KYQVJ3rJBSyBb";
export const WEBPACKED_FILE_PATH =
  process.env.WEBPACKED_FILE_PATH || "../dist/main.js";

const envKeywords = process.env.TEST_KEYWORDS ?? "";

export const TEST_KEYWORDS = envKeywords
  ? envKeywords.split(",")
  : ["TEST", "SMART TESTING"];
