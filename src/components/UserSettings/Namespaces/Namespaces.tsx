import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import { addNamespace, selectNamespaces } from "../../../reducers/NamespaceSlice";
import { useAppDispatch } from "../../../hooks";
import NamespaceActions from "./NamespaceActions";
import Namespace from "./Namespace";
import NamespaceForm from "./NamespaceForm";

type NamespacesProps = {
  hide: boolean;
};

const Namespaces: React.FC<NamespacesProps> = ({ hide }) => {
  const [addingNew, setAddingNew] = useState(false);
  const namespaces = useSelector(selectNamespaces);
  const dispatch = useAppDispatch();

  const handleAddingNamespace = () => {
    setAddingNew(true);
  };

  const handleCancelAddingNewNamespace = () => {
    setAddingNew(false);
  };

  const handleAddNewNamespace = (
    namespace: Pick<NamespaceObject, "prefix" | "uri">
  ) => {
    dispatch(addNamespace(namespace));
    setAddingNew(false);
  };

  if (hide) return null;

  return (
    <>
      <NamespaceActions onAdd={handleAddingNamespace} />
      <hr />
      <NamespaceForm
        validate
        hide={!addingNew}
        onCancel={handleCancelAddingNewNamespace}
        onSave={handleAddNewNamespace}
      />
      <ul aria-label="namespaces" className="space-y-5">
        {namespaces.map((namespace) => (
          <Fragment key={namespace.id}>
            <Namespace
              active={namespace.active}
              id={namespace.id}
              prefix={namespace.prefix}
              uri={namespace.uri}
            />
            <hr />
          </Fragment>
        ))}
      </ul>
    </>
  );
};

export default Namespaces;
export type { NamespacesProps };
