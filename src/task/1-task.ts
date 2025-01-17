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
]; // Array of backup APIs

export async function task(roundNumber: number): Promise<void> {
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);

    // Primary API URL
    const primaryUrl = "https://api.rawg.io/api/platforms?key=92f493e55c794f409435e8c95b94c20e";

    // Attempt fetching from primary API
    let data = await fetchData(primaryUrl);

    // Fallback mechanism if primary API fails
    if (!data) {
      console.warn("Primary API failed. Switching to backup APIs...");
      for (const url of BACKUP_API_URLS) {
        console.log(`Attempting to fetch from backup API: ${url}`);
        data = await fetchData(url);
        if (data) {
          console.log(`Successfully fetched data from backup API: ${url}`);
          break; // Exit loop if data is successfully fetched
        }
      }
    }

    // Store fetched data if available
    if (data) {
      await namespaceWrapper.storeSet(
        `round_${roundNumber}_data`,
        JSON.stringify(data)
      );
      console.log(`Fetched and stored data for round ${roundNumber}`);
    } else {
      console.error("No data fetched from any API.");
    }
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", (error as Error).message);
  }
}

async function fetchData(url: string): Promise<any> {
  try {
    console.log(`Attempting to fetch data from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch data from ${url}. Status: ${response.status}`);
      return null;
    }
    const data = await response.json();
    console.log(`Successfully fetched data from: ${url}`);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, (error as Error).message);
    return null;
  }
}
