import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Node, useNodes } from "reactflow";
import { TwitterPicker } from "react-color";
import { FormControl, InputLabel } from "@mui/material";
import {
  TeliAutocomplete,
  TeliButton,
  TeliSelect,
  TeliTextField,
} from "@telicent-oss/ds";
import { SelectChangeEvent } from "@telicent-oss/ds/dist/src/components/TeliSelect/TeliSelect";

import AlertDialog from "../../AlertDialog/AlertDialog";
import SubclassesList from "./SubclassesList";
import { useAppDispatch } from "../../../hooks";
import { addSuccess } from "../../../reducers/AlertSlice";
import { selectNamespaces } from "../../../reducers/NamespaceSlice";
import {
  ClassProperties,
  IconResult,
  IconStyle,
  createClass,
  deleteClass,
  fetchClassNode,
  fetchIcon,
} from "../../../services/ApiManager";

interface NodeDetailsProps {
  data: Node<Required<NodeData>>;
  onChange: (nodeId: string, newData: Required<NodeData>) => void;
  remove: (nodeId: string) => void;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({
  data,
  onChange,
  remove,
}) => {
  const dispatch = useAppDispatch();
  const namespaces = useSelector(selectNamespaces);
  const [selectedNode, setSelectedNode] = useState(data);
  const [nodeData, setNodeData] = useState(selectedNode.data);
  const {
    uri = "",
    label = "",
    namespace = "",
    color,
    backgroundColor,
    iconClass = "",
    created,
  } = nodeData;
  const [iconName, setIconName] = useState(iconClass);
  const [iconUnicode, setIconUnicode] = useState("");
  const [definition, setDefinition] = useState("");
  const [rdfType, setRdfType] = useState(
    "http://www.w3.org/2000/01/rdf-schema#Class"
  );
  const [autocompleteOptions, setAutocompleteOptions] = useState<IconStyle[]>(
    []
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [subclasses, setSubclasses] = useState<string[]>([]);

  const nodes: Node<Required<NodeData>>[] = useNodes();

  // this could cause and infinite loop
  useEffect(() => {
    setSelectedNode(data);
  }, [data]);

  useEffect(() => {
    const updatedSelectedNode = nodes.find(
      (node: Node) => node.id === selectedNode.id
    );
    if (updatedSelectedNode) {
      setSelectedNode(updatedSelectedNode);
    }
  }, [nodes]);

  useEffect(() => {
    if (!label) {
      if (selectedNode.id === "http://example.io/Class#node") {
        setRdfType("http://www.w3.org/2000/01/rdf-schema#Class");
      } else if (
        selectedNode.id === "http://example.io/datatypeProperty#node"
      ) {
        setRdfType("http://www.w3.org/2002/07/owl#DatatypeProperty");
      } else if (selectedNode.id === "http://example.io/objectProperty#node") {
        setRdfType("http://www.w3.org/2002/07/owl#ObjectProperty");
      }
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const node = await fetchClassNode(uri);
      if (!node) return;
      if (node.comments.length > 0) setComments(node.comments);
      if (node.rdfType.length > 0) setRdfType(node.rdfType[0]);
      if (node.subClasses.length > 0) setSubclasses(node.subClasses);
    };

    if (uri) fetchData();
  }, []);

  /**
   * CRITICAL data changes shouldn't be made here,
   * HOW where data is created, we should define handlers to modify
   * the data, and pass them into this component
   * WHY we want logic co-located - and this component dumb if we can help it
   * @param event
   */
  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    const updatedData = {
      ...nodeData,
      uri: `${namespace}${value || ""}`,
      label: value,
    };
    onChange(selectedNode.id, updatedData);
    setNodeData(updatedData);
  };

  const handleNamespaceChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    const updatedData = {
      ...nodeData,
      uri: `${value}${label}`,
      namespace: value,
    };
    onChange(selectedNode.id, updatedData);
    setNodeData(updatedData);
  };

  const handleBackgroundColorChange = (colour: { hex: string }) => {
    const updatedData = {
      ...nodeData,
      backgroundColor: colour.hex,
    };
    onChange(selectedNode.id, updatedData);
    setNodeData(updatedData);
  };

  const handleColorChange = (colour: { hex: string }) => {
    const updatedData = {
      ...nodeData,
      color: colour.hex,
    };
    onChange(selectedNode.id, updatedData);
    setNodeData(updatedData);
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event != null) event.preventDefault();
    // Create new class
    // What does created mean?
    // Does the mean a new node from scratch
    // or can it mean an updated one?
    if (!created) {
      const newNode: ClassProperties = {
        uri,
        rdfType: [rdfType],
        rdfsComment: [definition],
        defaultStyle: {
          defaultStyles: {
            dark: {
              backgroundColor,
              color,
            },
            light: {
              backgroundColor: color,
              color: backgroundColor,
            },
            shape: "circle",
            borderRadius: "3px",
            borderWidth: "1px",
            selectedBorderWidth: "3px",
          },
          defaultIcons: {
            faIcon: iconName,
            faUnicode: String.fromCharCode(parseInt(iconUnicode, 16)),
            faClass: "fa-solid",
          },
        },
      };
      const response = await createClass(newNode);
      if (response && response.length > 0) {
        dispatch(addSuccess(`A new class '${label}' has been created.`));
        setComments(newNode.rdfsComment || []);
        const updatedData = {
          ...nodeData,
          iconClass: iconName,
          created: true,
        };
        onChange(selectedNode.id, updatedData);
        setNodeData(updatedData);
      }
    }
  };

  const handleIconOptionSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    if (value != null) {
      setIconName(value);
      const iconStyle = autocompleteOptions.find((i) => i.faIcon === value);
      if (iconStyle) {
        setIconUnicode(iconStyle?.faUnicode);
      }
      const updatedData = { ...nodeData, iconClass: value };
      onChange(selectedNode.id, updatedData);
      setNodeData(updatedData);
    }
  };

  const handleIconInputChange = async (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setIconName(value);
    if (value != null) {
      const icons = await fetchIcon(value);

      if (icons.length === 0) return;

      const iconNames = icons
        .filter((icon: IconResult) => icon.styles.includes("solid"))
        .map((icon: IconResult) => ({
          faIcon: `fa-solid fa-${icon.id}`,
          faUnicode: icon.unicode,
          faClass: "fa-solid",
        }));
      setAutocompleteOptions(iconNames);

      //      if (icons && icons.total > 0) {
      //        const iconNames = icons.results
      //          .filter((i: IconResult) => i.document.styles.includes("solid"))
      //          .map((i: IconResult) => ({
      //            faIcon: `fa-solid fa-${i.document.fa_id}`,
      //            faUnicode: i.document.unicode,
      //            faClass: "fa-solid",
      //          }));
      //        setAutocompleteOptions(iconNames);
      //}
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    setShowDeleteDialog(false);
    await deleteClass(selectedNode.id);
    remove(selectedNode.id);
  };

  const pickerStyles = {
    default: {
      card: { backgroundColor: "#303030" },
      input: {
        backgroundColor: "#303030",
        border: "1px solid #575757",
        color: "#F5F5F5",
        boxShadow: "none",
      },
      hash: {
        backgroundColor: "#575757",
        color: "#F5F5F5",
      },
    },
  };

  const pickerColors = [
    "#FF6900",
    "#FCB900",
    "#7BDCB5",
    "#00D084",
    "#8ED1FC",
    "#0693E3",
    "#ABB8C3",
    "#EB144C",
    "#F78DA7",
  ];

  return (
    <div className="flex flex-col relative p-2 overflow-y-auto">
      <div className="flex items-center">
        <h2 className="description text-lg pb-2 flex-grow">Node Detail</h2>
        <TeliButton onClick={handleDelete} size="small">
          <i className="fa-solid fa-trash"></i>
        </TeliButton>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
        <TeliTextField
          fullWidth
          required
          label="Name"
          value={label}
          onChange={handleNameChange}
          placeholder="Entity name"
        />
        <TeliSelect
          id="namespace"
          label="Namespace"
          value={namespace}
          options={namespaces.map((n) => ({ label: n.prefix, value: n.uri }))}
          onChange={handleNamespaceChange}
        />
        <TeliAutocomplete
          label="Icon"
          placeholder="Icon"
          freeSolo
          options={autocompleteOptions.map((i) => i.faIcon)}
          onChange={handleIconOptionSelect}
          onInputChange={handleIconInputChange}
          inputValue={iconName}
          startAdornment={<i className={iconName} />}
          renderOption={(props, option) => (
            <li {...props}>
              <i className={option} />
              <span className="pl-2">{option}</span>
            </li>
          )}
        />
        <label className="text-lg font-medium text-white block">Color:</label>
        <TwitterPicker
          colors={pickerColors.concat(color)}
          styles={pickerStyles}
          color={color}
          triangle="hide"
          onChange={handleColorChange}
          className="mb-4"
        />
        <label className="text-lg font-medium text-white block">
          Background Color:
        </label>
        <TwitterPicker
          colors={pickerColors.concat(backgroundColor)}
          styles={pickerStyles}
          color={backgroundColor}
          triangle="hide"
          onChange={handleBackgroundColorChange}
          className="mb-4"
        />
        {comments && comments.length > 0 && (
          <>
            <InputLabel htmlFor="comments[]">Definitions</InputLabel>
            {comments.map((comment: string, index: number) => (
              <FormControl key={`comment-${index}`}>
                <TeliTextField
                  multiline
                  minRows={3}
                  maxRows={3}
                  defaultValue={comment}
                />
              </FormControl>
            ))}
          </>
        )}
        {rdfType === "http://www.w3.org/2000/01/rdf-schema#Class" && (
          <SubclassesList uri={uri} subclasses={subclasses} />
        )}
        {!created && (
          <>
            <InputLabel htmlFor="new-definition">Definition</InputLabel>
            <FormControl>
              <TeliTextField
                multiline
                minRows={3}
                maxRows={3}
                defaultValue={definition}
              />
            </FormControl>
            <TeliButton type="submit" variant="primary" disabled>
              Submit
            </TeliButton>
          </>
        )}
      </form>
      <AlertDialog
        open={showDeleteDialog}
        title="Delete this class"
        content="Deleting this class will remove it from the ontology"
        onAccept={handleDeleteAccept}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default NodeDetails;
