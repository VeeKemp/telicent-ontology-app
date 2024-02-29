import { screen, within } from "@testing-library/dom";
import { UserEvent } from "@testing-library/user-event";
import { renderWithProviders } from "../../../../testUtils";
import Namespaces, { NamespacesProps } from "../Namespaces";

const renderNamespaces = (props?: NamespacesProps) =>
  renderWithProviders(<Namespaces hide={false} {...props} />);

describe("Namespaces component", () => {
  test("does NOT render component when hide is set to true", () => {
    const { container } = renderNamespaces({ hide: true });

    expect(container).toBeEmptyDOMElement();
  });

  test("renders 2 default namespaces", () => {
    renderNamespaces();

    const namespacesList = screen.getByRole("list", { name: "namespaces" });
    expect(within(namespacesList).getAllByRole("listitem")).toHaveLength(2);

    expect(screen.getByRole("listitem", { name: "telicent" })).toBeVisible();
    expect(screen.getByText("http://telicent.io/ontology/")).toBeVisible();

    expect(screen.getByRole("listitem", { name: "ies" })).toBeVisible();
    expect(
      screen.getByText("http://ies.data.gov.uk/ontology/ies4#")
    ).toBeVisible();
  });

  test("renders namespace form when add button is clicked", async () => {
    const { user } = renderNamespaces();

    await clickAddNewNamespace(user);
    checkForm({ isVisible: true });
  });

  test("does NOT render namespace form when adding is dismissed/cancelled", async () => {
    const { user } = renderNamespaces();
    await clickAddNewNamespace(user);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    checkForm({ isRendered: false });
  });

  test("renders newly added namespace", async () => {
    const { user } = renderNamespaces();
    await clickAddNewNamespace(user);

    const prefix = "starwars";
    const uri = "http://telicent.io/starwars/";
    await fillNamespaceForm(user, prefix, uri);
  });

  test("does NOT render a deleted namespace", async () => {
    const { user } = renderNamespaces();
    const telicentNamespace = screen.getByRole("listitem", {
      name: "telicent",
    });
    const telicentNamespaceDeleteBtn = within(telicentNamespace).getByRole(
      "button",
      { name: "Delete namespace" }
    );

    await user.click(telicentNamespaceDeleteBtn);
    expect(
      screen.queryByRole("listitem", { name: "telicent" })
    ).not.toBeInTheDocument();
  });

  test("renders updated namespace", async () => {
    const { user } = renderNamespaces();
    const telicentNamespace = screen.getByRole("listitem", {
      name: "telicent",
    });
    const telicentNamespaceEditBtn = within(telicentNamespace).getByRole(
      "button",
      { name: "Edit namespace" }
    );
    await user.click(telicentNamespaceEditBtn);

    const updatedPrefix = "telicent-123";
    const updatedUri = "http://telicent.io/ontology/123";

    await fillNamespaceForm(user, updatedPrefix, updatedUri);
  });
});

const clickAddNewNamespace = async (user: UserEvent) => {
  await user.click(screen.getByRole("button", { name: "Add new namespace" }));
};

const checkForm = async ({
  isVisible = false,
  isRendered = true,
}: {
  isVisible?: boolean;
  isRendered?: boolean;
}) => {
  if (isVisible) {
    expect(
      screen.getByRole("form", { name: "Namespace information" })
    ).toBeVisible();
  }

  if (isRendered) {
    expect(
      screen.getByRole("form", { name: "Namespace information" })
    ).toBeInTheDocument();
  } else {
    expect(
      screen.queryByRole("form", { name: "Namespace information" })
    ).not.toBeInTheDocument();
  }
};

const fillNamespaceForm = async (
  user: UserEvent,
  prefix: string,
  uri: string
) => {
  const prefixTextbox = screen.getByRole("textbox", { name: "Prefix" });
  await user.clear(prefixTextbox);
  await user.type(prefixTextbox, prefix);
  expect(prefixTextbox).toHaveValue(prefix);

  const uriTextbox = screen.getByRole("textbox", { name: "Uri" });
  await user.clear(uriTextbox);
  await user.type(uriTextbox, uri);
  expect(uriTextbox).toHaveValue(uri);

  await user.click(screen.getByRole("button", { name: "Apply" }));

  // checks updated values are visible to the user
  expect(screen.getByRole("listitem", { name: prefix })).toBeVisible();
  expect(screen.getByRole("heading", { name: prefix })).toBeVisible();
  expect(screen.getByText(uri)).toBeVisible();

  // check form is not rendered after it's completed successfully
  checkForm({ isRendered: false });
};
