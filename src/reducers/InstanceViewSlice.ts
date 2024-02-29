import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RDF } from "../models";

const INITIAL_RDF_PREFIXES: Record<string, string> = {
  data: "http://data.gov/data#",
  ies: "http://ies.data.gov.uk/ontology/ies4#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  telicent: "http://telicent.io/ontology/",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

const createRDFPrefixes = (rdfPrefixes: Record<string, string>) => {
  return Object.keys(rdfPrefixes).map((prefix, index, prefixes) =>
    RDF.createPrefix({
      prefix,
      value: rdfPrefixes[prefix],
      startOnNewLine: index !== 0,
      endOnNewLine: index === prefixes.length - 1,
    }).convertToString()
  );
};

const initialState = {
  attribute: "",
  rdfPrefixes: INITIAL_RDF_PREFIXES,
  rdf: createRDFPrefixes(INITIAL_RDF_PREFIXES),
};

const removeNodeInRDFCode = (rdfCode: string[], nodeId: string) => {
  return rdfCode.filter((rdfLine) => !rdfLine.includes(`data:${nodeId}`));
};

const removeCodeLine = (rdfCode: string[], lineToDelete: string[]) => {
  return rdfCode.filter(
    (rdfLine) => rdfLine !== RDF.convertToString(lineToDelete)
  );
};

const removeEdgeInRDFCode = (
  rdfCode: string[],
  source: string,
  target: string
) => {
  return rdfCode.filter(
    (codeLine) => codeLine.includes(source) && codeLine.includes(target)
  );
};

const InstanceViewSlice = createSlice({
  name: "instanceView",
  initialState,
  reducers: {
    setAttribute: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        attribute: action.payload,
      };
    },
    updateRDFPrefix: (
      state,
      action: PayloadAction<{ prefix: string; value: string }>
    ) => {
      return {
        ...state,
        rdfPrefixes: {
          ...state.rdfPrefixes,
          [action.payload.prefix]: action.payload.value,
        },
      };
    },
    addRDFCode: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        rdf: [...state.rdf, action.payload],
      };
    },
    replaceRDFCodeLine: (
      state,
      action: PayloadAction<{ rdfLine: string[]; updatedRdfLine: string[] }>
    ) => {
      const modifiedRDFCode = state.rdf.map((rdfLine) => {
        if (rdfLine.includes(RDF.convertToString(action.payload.rdfLine))) {
          return RDF.convertToString(action.payload.updatedRdfLine);
        }
        return rdfLine;
      });

      return {
        ...state,
        rdf: modifiedRDFCode,
      };
    },
    deleteRDFCodeLine: (
      state,
      action: PayloadAction<
        Partial<{
          nodeId: string;
          rdfCodeLine: string[];
          source: string;
          target: string;
        }>
      >
    ) => {
      let modifiedRDFCode = state.rdf;

      if (action.payload.nodeId) {
        modifiedRDFCode = removeNodeInRDFCode(state.rdf, action.payload.nodeId);
      }

      if (action.payload.rdfCodeLine) {
        modifiedRDFCode = removeCodeLine(state.rdf, action.payload.rdfCodeLine);
      }

      if (action.payload.source && action.payload.target) {
        const { source, target } = action.payload;
        if (source.startsWith("textNode") || target.startsWith("textNode")) {
          modifiedRDFCode = state.rdf;
        } else modifiedRDFCode = removeEdgeInRDFCode(state.rdf, source, target);
      }

      return {
        ...state,
        rdf: modifiedRDFCode,
      };
    },
    writeRDFCode: (state, action: PayloadAction<string>) => {
      const codeLines = action.payload
        .split("\n")
        .map((codeLine, index) => `${RDF.addNewLine(index !== 0)}${codeLine}`);

      return {
        ...state,
        rdf: codeLines,
      };
    },
  },
});

export const selectAttribute = (state: RootState) =>
  state.instanceView.attribute;

export const selectRDFCode = (state: RootState) =>
  state.instanceView.rdf.join(" ");

export const {
  setAttribute,
  updateRDFPrefix,
  addRDFCode,
  replaceRDFCodeLine,
  writeRDFCode,
  deleteRDFCodeLine,
} = InstanceViewSlice.actions;
export default InstanceViewSlice.reducer;
