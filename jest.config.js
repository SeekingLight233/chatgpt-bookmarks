module.exports = {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }]
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>$1"
  }
}
