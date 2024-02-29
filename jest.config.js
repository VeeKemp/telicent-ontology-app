export default {
  preset: "ts-jest",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/**/*.{ts,tsx}",
    "src/selectedNodes/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFiles: [
    "jsdom-worker"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/src/setupTests.ts",
  ],
  // rootDir: 'src',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    // "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/file.js",
  },
  moduleNameMapper: {
    "\\.css$": "<rootDir>/src/__mocks__/styleMock.js",
  },
};
