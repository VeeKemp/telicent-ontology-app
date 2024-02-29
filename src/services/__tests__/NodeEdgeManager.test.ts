import {
  createInstanceNodesEdges, getDiagramNodesAndEdges,
} from "../NodeEdgeManager";

import { processEnvInit } from "../testUtils";

processEnvInit();

describe("NodeEdgeManager", () => {
  beforeAll(() => {
    processEnvInit();
  });

  it.skip("should get diagram nodes", async () => {
    const result = await getDiagramNodesAndEdges("diagramId");
    expect(result).toBeInstanceOf(Array);
  });

  it.skip("should create instance nodes and edges", () => {
    const result = createInstanceNodesEdges([]);
    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("edges");
  });
});
