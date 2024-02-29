const env = process.env;
import OntologyService from "@telicent-oss/ontologyservice";

type Endpoint = "ontology" | "search";

type AppConfig = {
  beta: boolean;
  fontawesome: {
    key: string;
  };
  api: {
    ontology: string;
  };
};

const APP_CONFIG: AppConfig = {
  beta: env?.BETA ? JSON.parse(env.BETA) : true,
  api: {
    ontology: env?.ONTOLOGY_SERVICE_URL ?? "",
  },
  fontawesome: {
    key: env?.FONTAWESOME_KEY ?? "",
  },
};

const ontologyService = new OntologyService(
  APP_CONFIG.api.ontology,
  "ontology"
);

export default APP_CONFIG;
export { ontologyService };
