import React, { useEffect, useState } from "react";
import {
  TeliSpinner,
  useOntologyStyles,
  checkOntology,
  OntologyHierarchy,
  OntologyInputHierarchy,
} from "@telicent-oss/ds";

import { fetchHierarchy, HierarchyClass } from "../../../services/ApiManager";

interface SubclassesListProps {
  subclasses: string[];
  uri: string;
}

const SubclassesList: React.FC<SubclassesListProps> = ({ uri, subclasses }) => {
  const [hierarchy, setHierarchy] = useState<OntologyInputHierarchy | null>(
    null
  );
  const { findIcon } = useOntologyStyles();
  const createHierarchyElement = (uri: string) => {
    const ontology = checkOntology(uri, findIcon);
    const element: OntologyInputHierarchy = {
      name: ontology.alt,
      id: uri,
      ontology,
      children: [],
    };
    return element;
  };

  const hierarchyList = (
    buildHierarchy: OntologyInputHierarchy[],
    classes: Record<string, HierarchyClass>,
    key: string
  ) => {
    const element = classes[key];
    if (element.subClasses && element.subClasses.length > 0) {
      element.subClasses.forEach((subclass) => {
        const classStyles = createHierarchyElement(subclass);
        if (classStyles != null) {
          buildHierarchy.push(classStyles);
          if (classStyles.children) {
            hierarchyList(classStyles.children, classes, subclass);
          }
        }
      });
    }
  };

  const convertToHierarchy = (classObject: Record<string, HierarchyClass>) => {
    const buildHierarchy: OntologyInputHierarchy = {
      name: "root",
      id: "root",
      ontology: checkOntology("root", findIcon),
      children: [],
    };
    if (buildHierarchy.children) {
      hierarchyList(
        buildHierarchy.children,
        classObject,
        "http://ies.data.gov.uk/ontology/ies4#ExchangedItem"
      );
    }
    return buildHierarchy;
  };

  useEffect(() => {
    const getHierarchy = async () => {
      const response = await fetchHierarchy();
      const convertedHierarchy = convertToHierarchy(response);
      setHierarchy(convertedHierarchy);
    };
    getHierarchy();
  }, []);

  if (subclasses.length === 0) {
    return null;
  }

  if (hierarchy == null) {
    return (
      <div className="flex justify-center">
        <TeliSpinner />
      </div>
    );
  }

  return (
    <div>
      <label className="text-lg font-medium text-white block">Subclasses</label>
      <OntologyHierarchy
        instanceId={`classes-list-subclasses-list`}
        data={hierarchy}
        descendantCount={false}
        baseKey={uri}
      />
    </div>
  );
};

export default SubclassesList;
