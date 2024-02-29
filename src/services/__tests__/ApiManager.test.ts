import {
  fetchDiagramSummaries,
  createClass,
  deleteClass,
  fetchClassNode,
  deleteRelationship,
  fetchAllStyles,
  fetchIcon,
  fetchHierarchy,
} from "../ApiManager";

import { processEnvInit } from "../testUtils";

describe("ApiManager", () => {
  beforeAll(() => {
    processEnvInit();
  });

  it.skip("fetchDiagramSummaries", async () => {
    const data = await fetchDiagramSummaries();
    expect(data).toBeDefined();
  });

  it.skip("createClass", async () => {
    const data = await createClass({ uri: "testUri", rdfType: ["testType"] });
    expect(data).toBeDefined();
  });

  it.skip("deleteClass", async () => {
    try {
      await deleteClass("testUri");
      expect(true).toBeTruthy();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it.skip("fetchClassNode", async () => {
    try {
      const data = await fetchClassNode("testUri");
      expect(data).toBeDefined();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it.skip("deleteRelationship", async () => {
    try {
      const data = await deleteRelationship(
        "testPredicate",
        "testSubject",
      );
      expect(data).toBeDefined();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it.skip("fetchAllStyles", async () => {
    const data = await fetchAllStyles();
    expect(data).toBeDefined();
  });

  it.skip("fetchIcon", async () => {
    try {
      const data = await fetchIcon("testIcon");
      expect(data).toBeDefined();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it.skip("fetchHierarchy", async () => {
    const data = await fetchHierarchy();
    expect(data).toBeDefined();
  });
});
