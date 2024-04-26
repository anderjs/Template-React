module.exports = {
  rootDir: "src",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    axios: "axios/dist/node/axios.cjs",
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
    "^@lang/(.*)$": "<rootDir>/lang/$1",
    "^@views/(.*)$": "<rootDir>/views/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@config/(.*)$": "<rootDir>/config/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
    "^@components/(.*)$": "<rootDir>/components/$1",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
