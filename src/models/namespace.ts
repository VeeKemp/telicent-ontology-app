class Namespace {
  private static namespaceLookup: Record<string, string> = {
    ies: "http://ies.data.gov.uk/ontology/ies4#",
    telicent: "http://telicent.io/ontology/",
    data: "http://data.gov/data#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    dc: "http://purl.org/dc/elements/1.1/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    owl: "http://www.w3.org/2002/07/owl#",
  };

  private static lookupBaseUri(prefix: string) {
    if (prefix in Namespace.namespaceLookup) {
      return Namespace.namespaceLookup[prefix];
    }
    return null;
  }

  private static lookupPrefix(uri: string) {
    const foundPrefixes = Object.keys(Namespace.namespaceLookup).filter((key) =>
      uri.startsWith(Namespace.namespaceLookup[key])
    );
    if (foundPrefixes.length > 1) {
      console.error(
        `Duplicate namespace uris have been found in ${Namespace.namespaceLookup}`
      );
      return null;
    }
    return foundPrefixes[0];
  }

  private static findNamespace(uri: string) {
    const prefix = this.lookupPrefix(uri);

    if (!prefix) return { prefix: null, uri: null };

    const baseUri = this.lookupBaseUri(prefix);
    return { prefix, uri: baseUri };
  }

  static replaceWithPrefix(uri: string) {
    const namespace = this.findNamespace(uri);
    return namespace?.uri
      ? uri.replace(namespace.uri, `${namespace.prefix}:`)
      : null;
  }

  static stripUri(uri: string) {
    const namespace = this.findNamespace(uri);
    return namespace?.uri ? uri.replace(namespace.uri, "") : null;
  }
}

export default Namespace;
