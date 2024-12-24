import { namespaceWrapper, app } from "@_koii/namespace-wrapper";

export async function routes() {
  app.get("/data/:round", async (req, res) => {
    const roundNumber = req.params.round;
    const dataKey = `round_${roundNumber}_data`;
    const data = await namespaceWrapper.storeGet(dataKey);

    res.status(200).json({ round: roundNumber, data: JSON.parse(data || "[]") });
  });
}
