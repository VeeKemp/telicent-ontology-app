type NamespaceID = `${string}-${string}-${string}-${string}-${string}`;

type NamespaceObject = {
  id: NamespaceID;
  prefix: string;
  uri: string;
  active: boolean;
};
