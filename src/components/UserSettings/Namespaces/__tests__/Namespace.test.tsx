import { screen, within } from "@testing-library/dom";
import { renderWithProviders } from "../../../../testUtils";
import Namespace, { NamespaceProps } from "../Namespace";

const existingPrefix = "telicent";
const existingUri = "http://telicent.io/ontology/";

const renderNamespace = (props?: Partial<NamespaceProps>) =>
  renderWithProviders(
    <Namespace
      active={false}
      id={crypto.randomUUID()}
      prefix={existingPrefix}
      uri={existingUri}
      {...props}
    />
  );

describe("Namespace component", () => {
  test("renders namespace prefix", () => {
    renderNamespace();

    expect(screen.getByRole("heading", { name: existingPrefix })).toBeVisible();
  });

  test("renders namespace uri", () => {
    renderNamespace();

    expect(screen.getByText(existingUri)).toBeVisible();
  });

  test("renders namespace form when edit button is clicked", async () => {
    const { user } = renderNamespace();
    await user.click(screen.getByRole("button", { name: "Edit namespace" }));

    expect(
      screen.getByRole("form", { name: "Namespace information" })
    ).toBeVisible();
  });

  test("does NOT render namespace form when editing is dismissed/cancelled", async () => {
    const { user } = renderNamespace();
    await user.click(screen.getByRole("button", { name: "Edit namespace" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("form", { name: "Namespace information" })
    ).not.toBeInTheDocument();
  });

  test("renders delete button as disabled when namespace is active", () => {
    renderNamespace({ active: true });

    const telicentNamespace = screen.getByRole("listitem", {
      name: "telicent",
    });
    const telicentNamespaceDeleteBtn = within(telicentNamespace).getByRole(
      "button",
      { name: "Delete namespace" }
    );
    expect(telicentNamespaceDeleteBtn).toBeDisabled();
  });
});
