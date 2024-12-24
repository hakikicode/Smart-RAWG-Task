import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function audit(
  submission: string,
  roundNumber: number,
  submitterKey: string
): Promise<boolean | void> {
  try {
    console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);

    // Handle chunk references
    if (submission.startsWith("round_")) {
      const storedChunks = await namespaceWrapper.storeGet(submission);
      if (!storedChunks) {
        console.error("Chunks not found for submission:", submission);
        return false;
      }

      const chunks: string[] = JSON.parse(storedChunks);

      // Ensure chunks are an array before joining
      if (Array.isArray(chunks)) {
        const reconstructedData = chunks.join("");
        console.log("Reconstructed data:", reconstructedData);
        return reconstructedData.includes("Grand Theft Auto V"); // Example validation
      } else {
        console.error("Invalid data format: Chunks are not an array");
        return false;
      }
    }

    // Validate small submissions directly
    console.log("Validating direct submission:", submission);
    return submission.includes("Grand Theft Auto V"); // Example validation
  } catch (error) {
    console.error("AUDIT ERROR:", (error as Error).message);
    return false;
  }
}
