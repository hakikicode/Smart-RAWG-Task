import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function audit(
  submission: string,
  roundNumber: number,
  submitterKey: string
): Promise<boolean | void> {
  try {
    console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);

    // Check if the submission references a stored chunk
    if (submission.startsWith("round_")) {
      console.log(`Handling chunked submission with key: ${submission}`);
      const storedChunks = await namespaceWrapper.storeGet(submission);

      if (!storedChunks) {
        console.error(`Chunks not found for key: ${submission}`);
        return false;
      }

      // Parse and reconstruct the data
      const chunks: string[] = JSON.parse(storedChunks);

      if (Array.isArray(chunks)) {
        const reconstructedData = chunks.join("");
        console.log("Reconstructed data:", reconstructedData);

        // Example validation logic
        if (reconstructedData.includes("Grand Theft Auto V")) {
          console.log("Audit passed: Submission contains valid data.");
          return true;
        } else {
          console.warn("Audit failed: Submission does not contain valid data.");
          return false;
        }
      } else {
        console.error("Invalid data format: Chunks are not an array");
        return false;
      }
    }

    // Handle direct submissions
    console.log("Validating direct submission:", submission);
    if (submission.includes("Grand Theft Auto V")) {
      console.log("Audit passed: Direct submission contains valid data.");
      return true;
    } else {
      console.warn("Audit failed: Direct submission does not contain valid data.");
      return false;
    }
  } catch (error) {
    console.error("AUDIT ERROR:", (error as Error).message);
    return false;
  }
}
