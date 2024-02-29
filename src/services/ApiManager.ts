import {
  InMemoryCache,
  ApolloClient,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SPARQLObject } from "@telicent-oss/rdfservice";

import { addError } from "../reducers/AlertSlice";
import config, { ontologyService } from "../config/app-config";
import { store } from "../store";

const httpLink = createHttpLink({
  uri: "https://api.fontawesome.com",
});

const authLink = setContext((_, { headers }) => {
  const apiKey = config.fontawesome.key;
  return {
    headers: {
      ...headers,
      authorization: apiKey ? `Bearer ${apiKey}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const fetchData = async (url: string) =>
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((error: Error) => {
      // if API returns useful message get from response here
      throw error;
    });

export interface DiagramSummary {
  uri: string;
  uuid: string;
  name: string;
}

export interface Element {
  id?: string;
  name?: string;
  uri: string;
  representedElement: string;
  // inDiagram: string;
  style: {
    shape: string;
    bgColour: string;
    colour: string;
    borderColour: string;
    icon: string;
    x: number;
    y: number;
    height: number;
    width: number;
  };
  // abacLabels: string; // is this used anywhere?
}

export interface Relationship {
  // inDiagram: string; // is this used anywhere?
  representedRelationship: string;
  source: string;
  target: string;
  uri: string;
}

export interface IconStyle {
  riIcon?: string;
  faIcon: string;
  faUnicode: string;
  faClass: string;
}

export interface DefaultStyle {
  defaultStyles: {
    dark: {
      backgroundColor: string;
      color: string;
    };
    light: {
      backgroundColor: string;
      color: string;
    };
    shape: string;
    borderRadius: string;
    borderWidth: string;
    selectedBorderWidth: string;
  };
  defaultIcons: IconStyle;
}

export interface ClassProperties {
  uri: string;
  rdfType: string[];
  rdfsLabel?: string[];
  rdfsComment?: string[];
  rdfsSubClassOf?: string[];
  rdfsSubPropertyOf?: string[];
  objectProperties?: object;
  datatypeProperties?: object;
  abacLabels?: string;
  ownedProperties?: string[];
  inverseOwnedProperties?: string[];
  defaultStyle?: DefaultStyle;
}

export interface HierarchyClass {
  subClasses: string[];
  types: string[];
  comments: string[];
  labels: string[];
  keys: string[];
}

export interface IconResult {
  id: string;
  unicode: string;
  styles: string[];
}
//export interface IconResult {
//  id: string;
//  score: number;
//  document: {
//    fa_id: string;
//    terms: string[];
//    unicode: string;
//    styles: string[];
//  };
//}
export interface IconSearch {
  total: number;
  limit: number;
  offset: number;
  query: string;
  type: string;
  results: IconResult[];
}

const sortByNameDescending = (a: DiagramSummary, b: DiagramSummary) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

/**
 * Returns an array of diagram summaries.
 * @remarks
 * The diagram summaries must be sorted alphabetically by name for the
 * output to be drawn as expected.
 */
export const fetchDiagramSummaries = async () => {
  const rawResponse = await ontologyService.getAllDiagrams();
  return rawResponse
    .map((r) => ({ uri: r.uri, uuid: r.uuid, name: r.title }) as DiagramSummary)
    .sort(sortByNameDescending);
};

export const fetchDiagram = async (unencodedUri: string) =>
  await ontologyService.getDiagram(unencodedUri);

// this does not exist on ontologyService because you shouldn't be
// able to create orphan classes, which the ontology-api allows.
export const createClass = async (data: ClassProperties) => {
  if (!data.uri) throw new Error("Creation Failed");
  const [type] = data.rdfType;
  const { backgroundColor: bgColour, color: colour } =
    data.defaultStyle!.defaultStyles.dark;
  const { faIcon } = data.defaultStyle!.defaultIcons;
  const styleObject = {
    bgColour,
    colour,
    icon: faIcon,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    shape: "diamond",
    borderColour: undefined,
  } as const;

  try {
    return ontologyService.newClass(data.uri, type, styleObject);
  } catch {
    store.dispatch(addError("There was an error creating a new class"));
  }
};

export const deleteClass = async (uri: string) => {
  try {
    // no equivalent method on ontologyService
    const query = `
        DELETE WHERE {<${uri}> ?p ?o} ;
        DELETE WHERE {?s1 ?p1 <${uri}>};
    `;
    await ontologyService.runUpdate(query);
  } catch {
    store.dispatch(addError("There was an error deleting the class"));
  }
};

export const fetchClassNode = async (uri: string) => {
  try {
    return await ontologyService.getClass(uri);
  } catch (e) {
    store.dispatch(addError("There was an error fetching the node"));
  }
};

export const deleteRelationship = async (
  predicate: string,
  subject: string
) => {
  try {
    await ontologyService.deleteRelationships(subject, predicate);
  } catch {
    store.dispatch(addError("There was an error deleting the class"));
  }
};

// export const postTriples = async (triples: object) => {
//   console.log(triples)
//   // const response = await ontologyService.insertTriple()
//   const response = await postData(`${getBaseUrl()}/ontology/triples`, triples);
//   return response;
// };

export const fetchAllStyles = async () => await ontologyService.getStyles();

export const fetchIcon = async (icon: string) => {
  try {
    const result = await client.query({
      query: gql`
        query {
          search(version: "6.0.0", query: "${icon}", first: 5) {
            id
            unicode
            styles
          }
        }
      `,
    });

    return result.data.search;
  } catch (err) {
    console.error("Failed to get icons: ", err);
  }
};

// export const fetchIcon = async (icon: string, free: boolean) => {
//   const searchParams = new URLSearchParams({ query: icon });
//   if (free) {
//     searchParams.append("free", "true");
//   }
//   const response = await fetchData(
//     `${getSearchUrl()}/icons?${searchParams.toString()}`
//   );
//   return response as IconSearch;
// };

type hierarchyResponse = {
  sub: SPARQLObject;
  super: SPARQLObject;
  subType: SPARQLObject;
  subComment: SPARQLObject;
  subLabel: SPARQLObject;
};
// Naughty: get rid of?
// Builds the tree menu in all classes list
// shouldn't get all of the levels at once, should only do it in response
// to a user drilling down.
export const fetchHierarchy = async () => {
  const query = `SELECT ?sub ?super ?subType ?subComment ?subLabel
        WHERE 
        { 
            ?sub rdfs:subClassOf ?super .
            OPTIONAL {?sub rdf:type ?subType }
            OPTIONAL {?sub rdfs:label ?subLabel}
            OPTIONAL {?sub rdfs:comment ?subComment}
        }`;
  const sparqlOut = await ontologyService.runQuery<hierarchyResponse[]>(query);

  const getOrCreateHierarchy = (
    hierarchy: Record<string, HierarchyClass>,
    key: string
  ) => {
    if (!(key in hierarchy)) {
      hierarchy[key] = {
        subClasses: [],
        types: [],
        comments: [],
        labels: [],
        keys: [],
      };
    }
    return hierarchy[key];
  };

  const response = sparqlOut.results.bindings.reduce(
    (acc: Record<string, HierarchyClass>, item: hierarchyResponse) => {
      const hierarchy = { ...acc };

      const sub = getOrCreateHierarchy(hierarchy, item.sub.value);
      const superObj = getOrCreateHierarchy(hierarchy, item.super.value);

      if (!superObj.subClasses.includes(item.sub.value))
        superObj.subClasses.push(item.sub.value);
      if (item.subType && !sub.types.includes(item.subType.value))
        sub.types.push(item.subType.value);
      if (item.subComment && !sub.comments.includes(item.subComment.value))
        sub.comments.push(item.subComment.value);
      if (item.subLabel && !sub.labels.includes(item.subLabel.value))
        sub.labels.push(item.subLabel.value);

      return hierarchy;
    },
    {} as Record<string, HierarchyClass>
  );

  return response as Record<string, HierarchyClass>;
};

export const getAllRelationships = async () => {
  try {
    return (await ontologyService.getAllObjectProperties()) ?? [];
  } catch (err) {
    console.error(`failed to get relationships: ${err}`);
  }
};
