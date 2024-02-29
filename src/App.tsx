import React, { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { DSProviders, TeliStandardLayout } from "@telicent-oss/ds";

import OntologyView from "./views/OntologyView";
import InstanceView from "./views/InstanceView";
import { fetchAllStyles } from "./services/ApiManager";
import { addStyles } from "./reducers/StyleSlice";
import { useAppDispatch } from "./hooks";
import AlertMessages from "./components/AlertMessages/AlertMessages";
import UserProfile from "./components/UserProfile";
import { AppViewModes } from "./types";
import APP_CONFIG, { ontologyService } from "./config/app-config";
import { GlobalProvider } from "./context/GlobalContext";

const App = () => {
  const dispatch = useAppDispatch();
  const [activeView, setActiveView] = useState(AppViewModes.Ontology);

  useEffect(() => {
    const fetchStyleData = async () => {
      const styles = await fetchAllStyles();
      dispatch(addStyles(styles));
    };

    fetchStyleData();
  }, []);

  const appsArray = [
    { name: "search", url: "http://localhost:3000/live" },
    { name: "graph", url: "http://localhost:3000/live" },
    { name: "geo", url: "http://localhost:3000/live" },
    { name: "live", url: "http://localhost:3000/live" },
  ];

  return (
    <DSProviders ontologyService={ontologyService}>
      <TeliStandardLayout
        appName="ontology"
        beta={APP_CONFIG.beta}
        apps={appsArray}
        userProfile={<UserProfile />}
      >
        <GlobalProvider>
          <ReactFlowProvider>
            <AlertMessages />
            {activeView === AppViewModes.Ontology ? (
              <OntologyView onSetActiveView={setActiveView} />
            ) : (
              <InstanceView onSetActiveView={setActiveView} />
            )}
          </ReactFlowProvider>
        </GlobalProvider>
      </TeliStandardLayout>
    </DSProviders>
  );
};

export default App;
