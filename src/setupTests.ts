import { configure } from "@testing-library/react";
import { randomUUID } from "crypto";
import "@testing-library/jest-dom";

configure({ testIdAttribute: "id" });

/**
 * Crypto is not implemented in jsdom, therefore will throw an error
 * crypto.randomUUID is not a function. This is workaround for tests
 * https://github.com/jsdom/jsdom/issues/1612
 */
global.crypto.randomUUID = randomUUID;
