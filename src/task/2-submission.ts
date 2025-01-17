import { namespaceWrapper } from "@_koii/namespace-wrapper";

// Updated validation logic
function extractKeywords(data: string): string[] {
  const stopwords = new Set(["the", "and", "or", "a", "an", "is", "to", "of", "for", "in", "on", "at", "by", "with", "it", "this", "that", "as", "are", "was", "were", "be", "from", "has", "have", "had"]);
  const words = data
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, " ") // Replace non-alphanumeric characters with spaces
    .split(/\s+/)
    .filter((word) => word && !stopwords.has(word));

  // Ensure keywords meet length requirements and exclude concatenated entries
  return Array.from(new Set(words)).filter((word) => word.length > 2 && word.length < 50);
}

export async function submission(roundNumber: number): Promise<string | void> {
  try {
    console.log(`MAKE SUBMISSION FOR ROUND ${roundNumber}`);

    // Retrieve data from namespace storage
    const data = await namespaceWrapper.storeGet(`round_${roundNumber}_data`);

    if (!data) {
      console.warn(`No data found for round ${roundNumber}`);
      return "EMPTY_DATA";
    }

    const dataString = JSON.stringify(data);
    const keywords = extractKeywords(dataString);

    if (keywords.length > 0) {
      console.log(`Extracted keywords for round ${roundNumber}:`, keywords);

      // Check if the data needs to be chunked
      if (dataString.length > 512) {
        const chunks: string[] = [];
        const chunkSize = 500;
        for (let i = 0; i < dataString.length; i += chunkSize) {
          chunks.push(dataString.slice(i, i + chunkSize));
        }

        // Store the chunks in namespace with a consistent key
        const chunkKey = `round_${roundNumber}_chunks`;
        console.log(`Storing chunks with key: ${chunkKey}`);
        await namespaceWrapper.storeSet(chunkKey, JSON.stringify(chunks));

        return chunkKey;
      }

      // Store and return the data directly if small enough
      const singleDataKey = `round_${roundNumber}_data_single`;
      console.log(`Storing single data with key: ${singleDataKey}`);
      await namespaceWrapper.storeSet(singleDataKey, dataString);

      return singleDataKey;
    } else {
      console.warn(`No valid keywords found in data for round ${roundNumber}`);
      return "INVALID_DATA";
    }
  } catch (error) {
    console.error("MAKE SUBMISSION ERROR:", error);
    return "SUBMISSION_ERROR";
  }
}
