import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function submission(roundNumber: number): Promise<string | void> {
  try {
    console.log(`MAKE SUBMISSION FOR ROUND ${roundNumber}`);
    const data = await namespaceWrapper.storeGet(`round_${roundNumber}_data`);

    if (!data) {
      console.warn(`No data found for round ${roundNumber}`);
      return "EMPTY_DATA"; // Explicitly indicate no data was found
    }

    const dataString = JSON.stringify(data);

    if (dataString.includes("Grand Theft Auto V")) {
      console.log(`Valid data found for round ${roundNumber}:`, dataString);

      // Chunk data if it exceeds 512 bytes
      if (dataString.length > 512) {
        const chunks: string[] = [];
        const chunkSize = 500;
        for (let i = 0; i < dataString.length; i += chunkSize) {
          chunks.push(dataString.slice(i, i + chunkSize));
        }
        await namespaceWrapper.storeSet(
          `round_${roundNumber}_chunks`,
          JSON.stringify(chunks)
        );
        return `round_${roundNumber}_chunks`;
      }

      // Submit data directly if it's small
      return dataString;
    } else {
      console.warn(`Invalid data for round ${roundNumber}:`, dataString);
      return "INVALID_DATA"; // Explicitly indicate invalid data
    }
  } catch (error) {
    console.error("MAKE SUBMISSION ERROR:", (error as Error).message);
    return "SUBMISSION_ERROR"; // Indicate submission failure
  }
}
