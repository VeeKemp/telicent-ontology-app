import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getAllRelationships } from "../services/ApiManager";

// Get everything after the last slash, replace the hash with a colon
// and remove all numbers.
const getUserFriendlyURI = (s: string) =>
  s
    .substring(s.lastIndexOf("/") + 1)
    .replace("#", ":")
    .replaceAll(/\d+/g, "");

export type StringKeyObject = {
  [key: string]: string;
};

type Value = {
  relationships: StringKeyObject;
};

interface GlobalContextProps {
  children: ReactNode;
}

export const GlobalContext = createContext<Value>({
  relationships: {},
});

export const GlobalProvider: React.FC<GlobalContextProps> = ({ children }) => {
  const [relationships, setRelationships] = useState<StringKeyObject>({});

  useEffect(() => {
    const fetchData = async () => {
      const rels = await getAllRelationships();
      if (!rels) {
        console.warn("No relationships found.");
        return;
      }
      const relationshipLookup = rels.reduce(
        (acc: StringKeyObject, uri: string) => {
          acc[getUserFriendlyURI(uri)] = uri;
          return acc;
        },
        {}
      );
      setRelationships(relationshipLookup);
    };
    fetchData();
  }, []);

  return (
    <GlobalContext.Provider value={{ relationships }}>
      {children}
    </GlobalContext.Provider>
  );
};
