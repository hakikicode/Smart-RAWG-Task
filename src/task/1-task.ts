import { namespaceWrapper } from "@_koii/namespace-wrapper";
import fetch from "node-fetch";

const BACKUP_API_URLS = [
  "https://www.freetogame.com/api/games",
  "https://api-blue-archive.vercel.app/",
  "https://api.atlasacademy.io/export/NA/nice_servant_lore.json",
  "https://api.atlasacademy.io/export/NA/nice_servant.json",
  "https://api.atlasacademy.io/export/NA/nice_equip.json",
  "https://api.atlasacademy.io/export/JP/nice_servant.json",
  "https://api.atlasacademy.io/export/JP/nice_servant_lore.json",
  "https://xkcd.com/info.0.json",
  "https://raw.githubusercontent.com/ByMykel/counter-strike-file-tracker/main/static/csgo_english.json",
]; // Backup APIs

export async function task(roundNumber: number): Promise<void> {
  try {
    console.log(`EXECUTING TASK FOR ROUND ${roundNumber}`);

    // Check if data already exists in storage
    const storedData = await namespaceWrapper.storeGet(`round_${roundNumber}_data`);
    if (storedData) {
      console.log(`Data for round ${roundNumber} already exists in storage. Skipping API call.`);
      return;
    }

    // Fetch new data only if not stored
    const data = await fetchDataFromAPIs();
    if (data) {
      await namespaceWrapper.storeSet(`round_${roundNumber}_data`, JSON.stringify(data));
      console.log(`Fetched and stored new data for round ${roundNumber}`);
    } else {
      console.error(`No valid data fetched for round ${roundNumber}`);
    }
  } catch (error) {
    console.error("TASK EXECUTION ERROR:", (error as Error).message);
  }
}

async function fetchDataFromAPIs(): Promise<any> {
  const primaryUrl = "https://api.rawg.io/api/platforms?key=ed4bdc1b0e314a4782d5ae0f8b2eb8cf";

  // Try fetching from primary API
  let data = await fetchData(primaryUrl);

  // If primary API fails, try backup APIs
  if (!data) {
    console.warn("Primary API failed. Switching to backup APIs...");
    for (const url of BACKUP_API_URLS) {
      console.log(`Trying backup API: ${url}`);
      data = await fetchData(url);
      if (data) {
        console.log(`Successfully fetched from backup API: ${url}`);
        break; // Stop if valid data is found
      }
    }
  }

  return data;
}

async function fetchData(url: string): Promise<any> {
  try {
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch from ${url}. Status: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, (error as Error).message);
    return null;
  }
}
