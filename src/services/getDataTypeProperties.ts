import { useEffect, useState } from "react";
import { ontologyService } from "../config/app-config";
import Namespace from "../models/namespace";

// DTP = Data Type Properties

const OWL_DTP_SPARQL_QUERY = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT
    ?attribute
WHERE {
		?attribute a owl:DatatypeProperty .
}`;

type Response = {
  attribute: {
    type: "uri";
    value: string;
  };
};

export type Attribute = {
  uri: string;
  label: string;
};

const fetchAllOwlDTPs = async () => {
  const response =
    await ontologyService.runQuery<Response[]>(OWL_DTP_SPARQL_QUERY);

  const attributes = response.results.bindings.map((response) => ({
    uri: response.attribute.value,
    label:
      Namespace.replaceWithPrefix(response.attribute.value) ??
      response.attribute.value,
  }));
  return attributes;
};

const useAllOwlDTPs = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributes = await fetchAllOwlDTPs();
        setError(null);
        setAttributes(attributes);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("An unknown error occured while fetching owl attributes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { attributes, loading, error: error ?? undefined };
};

export default useAllOwlDTPs;
