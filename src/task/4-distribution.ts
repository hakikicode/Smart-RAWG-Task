import { Submitter, DistributionList } from "@_koii/task-manager";

const SLASH_PERCENT = 0.7;

export function distribution(
  submitters: Submitter[],
  bounty: number,
  roundNumber: number
): DistributionList {
  console.log(`MAKE DISTRIBUTION LIST FOR ROUND ${roundNumber}`);

  const distributionList: DistributionList = {};
  const approvedSubmitters: string[] = [];

  for (const submitter of submitters) {
    if (submitter.votes === 0) {
      distributionList[submitter.publicKey] = 0;
    } else if (submitter.votes < 0) {
      const slashedStake = Math.floor(submitter.stake * SLASH_PERCENT);
      distributionList[submitter.publicKey] = -slashedStake;
      console.log("CANDIDATE STAKE SLASHED", submitter.publicKey, slashedStake);
    } else {
      approvedSubmitters.push(submitter.publicKey);
    }
  }

  if (approvedSubmitters.length === 0) {
    console.warn(`No approved submitters for round ${roundNumber}`);
    return distributionList;
  }

  const reward = Math.floor(bounty / approvedSubmitters.length);
  approvedSubmitters.forEach((candidate) => {
    distributionList[candidate] = reward;
  });

  console.log("FINAL DISTRIBUTION LIST:", distributionList);
  return distributionList;
}
