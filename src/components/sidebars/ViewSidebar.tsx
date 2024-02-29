import React, { FC } from "react";

import DiagramsListPanel from "./panels/DiagramsListPanel";
import ClassesList from "./panels/NodeListPanel/ClassesList";
import RelationshipPicker from "./panels/RelationshipPicker";
import ViewSelector from "./panels/ViewSelector";
import Attributes from "./Attributes";
import { DiagramSummary } from "../../services/ApiManager";
import { AppViewModes } from "../../types";
import "./Sidebar.css";

/**
 * TODO Maybe refactor to take children
 * HOW Something like so:
 * ```tsx
 * const ViewSidebar = (props.position) =>
 *<Sidebar position={props.position}>
 *  <ViewSelector
 *      onSetActiveView={props.onSetActiveView}
 *      activeView={props.activeView}
 *    />
 *    {children}
 *</Sidebar>
 * ```
 * WHY to avoid a component that behaves differently
 * ALTERNATIVE move list of diagrams out (into modal?)
 *
 */

type BaseProps = {
  onSetActiveView: (view: AppViewModes) => void;
};

type OntologySpecificProps = {
  diagrams: DiagramSummary[];
  activeView: AppViewModes.Ontology;
  handleItemClick: (id: string) => Promise<void>;
};

type InstanceSpecificProps = {
  activeView: AppViewModes.Instance;
  onSetRelationship: (relationship: string) => void;
  onSetDragData: (data: string) => void;
};

type ViewSidebarProps = BaseProps &
  (OntologySpecificProps | InstanceSpecificProps);

const ViewSidebar: FC<ViewSidebarProps> = (props) => {
  return (
    <div
      className="absolute left-0 top-0 w-60 flex flex-col bg-black-200 h-full"
      id="left-sidebar"
    >
      <ViewSelector
        onSetActiveView={props.onSetActiveView}
        activeView={props.activeView}
      />
      {props.activeView === AppViewModes.Ontology && (
        <DiagramsListPanel
          diagrams={props.diagrams}
          handleItemClick={props.handleItemClick}
        />
      )}
      {props.activeView === AppViewModes.Instance && (
        <div className="overflow-y-scroll flex-grow h-0">
          <RelationshipPicker onSetRelationship={props.onSetRelationship} />
          <Attributes />
          <div className="relative">
            <ClassesList
              show
              instanceViewMode
              onSetDragData={props.onSetDragData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSidebar;
