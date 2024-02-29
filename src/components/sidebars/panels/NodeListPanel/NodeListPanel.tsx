import React, { FC, useEffect, useState } from "react";
import { Node } from "reactflow";
import Draggable from "react-draggable";
import {
  TeliButton,
  TeliTextField,
  useOntologyStyles,
  checkOntology,
  OntologyHierarchy,
  OntologyInputHierarchy,
} from "@telicent-oss/ds";

import ClassesList from "./ClassesList";
import { useAppDispatch } from "../../../../hooks";
import { addSelectedNode } from "../../../../reducers/SelectedNodesSlice";
import {
  fetchHierarchy,
  HierarchyClass,
} from "../../../../services/ApiManager";

interface NodeListPanelProps {
  nodes: Node<NodeData>[];
  setNodes: (nodes: Node<NodeData>[]) => void;
}

const NodeListPanel: FC<NodeListPanelProps> = ({ nodes, setNodes }) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [sortedNodes, setSortedNodes] = useState<Node<NodeData>[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [nodeFilter, setNodeFilter] = useState<string>("");
  const [hierarchy, setHierarchy] = useState<OntologyInputHierarchy | null>(
    null
  );
  // temp fix for the nodeFilter
  const visibleNodesList = sortedNodes.length > 0 ? sortedNodes : nodes;
  const visibleNodes = visibleNodesList.map((node) => node.data.uri);
  // copied across from Classes list

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

  const sortNodes = (unsorted: Node<NodeData>[]) =>
    unsorted
      .filter((node) => Boolean(node.data.label))
      .sort((a, b) => a.data.label.localeCompare(b.data.label))
      .filter(
        (node) =>
          !nodeFilter ||
          node.data.label.toLowerCase().includes(nodeFilter.toLowerCase())
      );

  useEffect(() => {
    setSortedNodes(sortNodes(nodes));
    const getHierarchy = async () => {
      const response = await fetchHierarchy();
      const convertedHierarchy = convertToHierarchy(response);
      setHierarchy(convertedHierarchy);
    };
    getHierarchy();
  }, [nodes]);

  const handleToggle = () => setExpanded(!isExpanded);

  const handleNodesClick = () => {
    setShowAll(!showAll);
  };

  const handleNodeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setNodeFilter(value);
    setSortedNodes(sortNodes(nodes));
  };

  const handleSelectNode = (nodeUri: string) => {
    const nodeIds: string[] = [];
    const selectedNodes = nodes.map((node) => {
      if (node.data.uri === nodeUri) {
        nodeIds.push(node.id);
        return {
          ...node,
          selected: true,
        };
      }
      return {
        ...node,
        selected: false,
      };
    });
    // I think maybe both the dispatch and setNodes is triggering a re-render of
    // OntologyHierarchy.  As with ClassesList example, decided with Alecs
    // this was out of scope for this branch - the OntologyHierarchy
    // functionality is working
    nodeIds.forEach((d) => {
      dispatch(addSelectedNode(d));
    });
    setNodes(selectedNodes);
  };

  // need a check so OntologyHierarchy does not re-render after a click event
  return (
    <Draggable>
      <section className="w-full min-w-[200px] max-w-[200px] flex flex-col p-3 bg-black-300 rounded-lg shadow my-4">
        <div className="flex justify-between items-center">
          <h2 className="description text-lg font-semibold">
            {showAll ? <span>All Classes</span> : <span>Current Nodes</span>}
          </h2>
          {showAll ? (
            <TeliButton
              size="small"
              title="Show current Nodes"
              onClick={handleNodesClick}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </TeliButton>
          ) : (
            <TeliButton
              size="small"
              title="Show all Nodes"
              onClick={handleNodesClick}
            >
              <i className="fa-solid fa-circle-nodes"></i>
            </TeliButton>
          )}
          {!showAll && (
            <span
              className="transform transition-transform duration-200"
              style={{ transform: `rotate(${isExpanded ? "180deg" : "0"})` }}
            >
              <svg
                onClick={handleToggle}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-white cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          )}
        </div>
        {showAll ? (
          <ClassesList show={showAll} />
        ) : (
          <>
            <div className="flex justify-between items-center text-gray-400 font-medium mt-1">
              <div className="text-whiteSmoke-300">Number of Nodes:</div>
              <div className="text-white">{nodes.length}</div>
            </div>
            <div
              id="node-list"
              className={`transition-all duration-500 ease-in-out ${
                isExpanded
                  ? "overflow-y-auto flex-grow"
                  : "overflow-y-hidden h-0"
              } overflow-x-hidden border-t border-gray-700 pt-2 mt-2`}
              style={{ maxHeight: "500px" }}
            >
              {nodes && nodes.length > 0 && hierarchy ? (
                <>
                  <div className="mt-2">
                    <TeliTextField
                      label="Node Filter"
                      value={nodeFilter}
                      onChange={handleNodeFilterChange}
                    />
                  </div>
                  <div className="relative overflow-y-auto overflow-x-auto max-h-80 max-w-[175px] ">
                    <OntologyHierarchy
                      instanceId={"filteredOH"}
                      data={hierarchy}
                      filterIds={visibleNodes}
                      isClickable={true}
                      clickEvent={handleSelectNode}
                    />
                  </div>
                </>
              ) : (
                <p>No nodes available</p>
              )}
            </div>
          </>
        )}
      </section>
    </Draggable>
  );
};

export default NodeListPanel;
