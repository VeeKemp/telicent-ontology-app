import React, { FC, useEffect, useState } from "react";
import {
  checkOntology,
  OntologyHierarchy,
  OntologyInputHierarchy,
  TeliSpinner,
  useOntologyStyles,
} from "@telicent-oss/ds";

import {
  HierarchyClass,
  fetchHierarchy,
} from "../../../../services/ApiManager";

interface ClassesListProps {
  show: boolean;
  instanceViewMode?: boolean;
  onSetDragData?: (data: string) => void;
}

/**
 * CRITICAL work out why prop.show is not used by this component
 */
const ClassesList: FC<ClassesListProps> = ({
  show,
  instanceViewMode = false,
  onSetDragData,
}) => {
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

  const dragEvent = (event: React.DragEvent, nodeType: string) => {
    // if (event.type !== 'dragstart') {
    //    return;
    //  }

    if (onSetDragData) {
      // onSetDragData is triggering the component to reset/rerender which
      // is messing with the drag.  Don't have a solution. Alecs advised
      // leaving it as the OntologyHierarchy functionality works
      onSetDragData(nodeType);
    }
  };

  // TODO needs proper equality check when we figure out what hierarchy
  // values are possible
  if (hierarchy == null) {
    return (
      <div className="flex justify-center">
        <TeliSpinner />
      </div>
    );
  }
  // need to add a check here to stop the re-render after a drag
  if (instanceViewMode) {
    return (
      <div className="">
        <OntologyHierarchy
          instanceId="classes-list-instanceView"
          data={hierarchy}
          descendantCount={false}
          isDraggable={true}
          dragEvent={dragEvent}
          expandElement={true}
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto overflow-x-auto max-h-80 max-w-[175px] ">
      <OntologyHierarchy
        instanceId="classes-list-collapsable"
        data={hierarchy}
      />
    </div>
  );
};

export default ClassesList;
