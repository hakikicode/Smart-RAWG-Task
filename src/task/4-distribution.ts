import { Submitter, DistributionList } from "@_koii/task-manager";

export async function distribution(
  submitters: Submitter[],
  bounty: number,
  roundNumber: number
): Promise<DistributionList> {  // Ensure the function returns a Promise

  console.log(`MAKE DISTRIBUTION LIST FOR ROUND ${roundNumber}`);

  const distributionList: DistributionList = {};
  const approvedSubmitters: string[] = [];

  for (const submitter of submitters) {
    if (submitter.votes <= 0) {
      distributionList[submitter.publicKey] = 0;
    } else {
      approvedSubmitters.push(submitter.publicKey);
    }
  }

  if (approvedSubmitters.length > 0) {
    const reward = Math.floor(bounty / approvedSubmitters.length);
    approvedSubmitters.forEach((candidate) => {
      distributionList[candidate] = reward;
    });
  } else {
    console.warn(`No approved submitters for round ${roundNumber}`);
  }

  console.log("FINAL DISTRIBUTION LIST:", distributionList);
  return Promise.resolve(distributionList); // Ensure it returns a Promise
}
