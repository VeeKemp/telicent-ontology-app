import { screen } from "@testing-library/dom";
import { UserEvent } from "@testing-library/user-event";
import { renderWithProviders } from "../../../../testUtils";
import NamespaceForm, { NamespaceFormProps } from "../NamespaceForm";

const renderForm = (props?: Partial<NamespaceFormProps>) =>
  renderWithProviders(
    <NamespaceForm onCancel={jest.fn()} onSave={jest.fn()} {...props} />
  );

const prefix = "telicent-123";
const uri = "http://my.telicent.uri/";

const existingPrefix = "telicent";
const existingUri = "http://telicent.io/ontology/";

describe("Namespace form component", () => {
  test("does NOT render when hide is set to true", () => {
    const { container } = renderForm({ hide: true });

    expect(container).toBeEmptyDOMElement();
  });

  test("renders form with blank values by default", () => {
    renderForm();

    expect(screen.getByRole("textbox", { name: "Prefix" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Uri" })).toHaveValue("");
  });

  test("renders Apply button as disabled when form values are blank", () => {
    renderForm();

    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  test("renders Apply button as disabled when values are not edited/updated", () => {
    renderForm({ prefix, uri });

    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  test("renders form with values", () => {
    renderForm({ prefix, uri });

    expect(screen.getByRole("textbox", { name: "Prefix" })).toHaveValue(prefix);
    expect(screen.getByRole("textbox", { name: "Uri" })).toHaveValue(uri);
  });

  test("renders error message when a new prefix already exists", async () => {
    const { user } = renderForm();
    await submitForm(user, existingPrefix, uri);

    checkPrefixErrorMsg({ isVisible: true });
  });

  test("renders error message when a new uri already exists", async () => {
    const { user } = renderForm();
    await submitForm(user, prefix, existingUri);

    checkUriErrorMsg({ isVisible: true });
  });

  test("renders error message when an edited prefix already exists", async () => {
    const updatedPrefix = "ies";

    const { user } = renderForm({ prefix, uri });
    await submitForm(user, updatedPrefix, uri);

    checkPrefixErrorMsg({ isVisible: true });
  });

  test("renders error message when an edited uri already exists", async () => {
    const updatedUri = "http://ies.data.gov.uk/ontology/ies4#";

    const { user } = renderForm({ prefix, uri });
    await submitForm(user, prefix, updatedUri);

    checkUriErrorMsg({ isVisible: true });
  });

  test("resets form values when values are submitted", async () => {
    const { user } = renderForm();
    await submitForm(user);

    expect(screen.getByRole("textbox", { name: "Prefix" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Uri" })).toHaveValue("");
  });

  test("onSave gets called with new form values", async () => {
    const mockedOnSave = jest.fn();

    const { user } = renderForm({ onSave: mockedOnSave });
    await submitForm(user);

    expect(mockedOnSave).toHaveBeenCalledWith({ prefix, uri });
  });

  test("onSave gets called with edited form values", async () => {
    const mockedOnSave = jest.fn();

    const { user } = renderForm({
      onSave: mockedOnSave,
      prefix: existingPrefix,
      uri: existingUri,
    });
    await submitForm(user, prefix, uri);

    expect(mockedOnSave).toHaveBeenCalledWith({ prefix, uri });
  });

  test("resets error state when all errors have been addressed", async () => {
    const { user } = renderForm();
    await submitForm(user, existingPrefix, existingUri);

    checkPrefixErrorMsg({ isVisible: true });
    checkUriErrorMsg({ isVisible: true });

    await typePrefix(user);
    await saveChanges(user);
    checkPrefixErrorMsg({ isRendered: false });
    checkUriErrorMsg({ isVisible: true });

    await typeUri(user);
    await saveChanges(user);
    checkPrefixErrorMsg({ isRendered: false });
    checkUriErrorMsg({ isRendered: false });
  });
});

const typePrefix = async (user: UserEvent, value?: string) => {
  const prefixTextbox = screen.getByRole("textbox", { name: "Prefix" });
  await user.clear(prefixTextbox);
  await user.type(prefixTextbox, value ?? prefix);
};

const typeUri = async (user: UserEvent, value?: string) => {
  const uriTextbox = screen.getByRole("textbox", { name: "Uri" });
  await user.clear(uriTextbox);
  await user.type(uriTextbox, value ?? uri);
};

const saveChanges = async (user: UserEvent) => {
  const applyBtn = screen.getByRole("button", { name: "Apply" });
  expect(applyBtn).not.toBeDisabled();
  await user.click(applyBtn);
};

const submitForm = async (
  user: UserEvent,
  prefixValue?: string,
  uriValue?: string
) => {
  await typePrefix(user, prefixValue);
  await typeUri(user, uriValue);
  await saveChanges(user);
};

type ErrorCheck = {
  msg: string;
  isVisible?: boolean;
  isRendered?: boolean;
};

const checkPrefixErrorMsg = ({
  isVisible = false,
  isRendered = true,
}: Pick<ErrorCheck, "isVisible" | "isRendered">) => {
  checkErrorMsg({ msg: "This prefix already exists", isVisible, isRendered });
};

const checkUriErrorMsg = ({
  isVisible = false,
  isRendered = true,
}: Pick<ErrorCheck, "isVisible" | "isRendered">) => {
  checkErrorMsg({ msg: "This uri already exists", isVisible, isRendered });
};

const checkErrorMsg = ({ msg, isVisible, isRendered }: ErrorCheck) => {
  if (isVisible) expect(screen.getByText(msg)).toBeVisible();

  if (isRendered) expect(screen.getByText(msg)).toBeInTheDocument();
  else expect(screen.queryByText(msg)).not.toBeInTheDocument();
};
