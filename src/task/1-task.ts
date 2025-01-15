import { namespaceWrapper } from "@_koii/namespace-wrapper";
import fetch from "node-fetch";

const RAWG_API_KEY = "92f493e55c794f409435e8c95b94c20e"; // RAWG API key

export async function task(roundNumber: number): Promise<void> {
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
    const url = `https://api.rawg.io/api/platforms?key=${RAWG_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Store fetched data for auditing
    if (data && data.results) {
      await namespaceWrapper.storeSet(`round_${roundNumber}_data`, JSON.stringify(data.results));
      console.log(`Fetched and stored data for round ${roundNumber}`);
    } else {
      console.warn("No data fetched from RAWG API.");
    }
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", (error as Error).message);
  }  
}
