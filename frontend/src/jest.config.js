export const transform = {
  "^.+\\.[t|j]sx?$": "babel-jest",
};

export const transformIgnorePatterns = ["node_modules/(?!(axios)/)"];

export const moduleNameMapper = {
  "\\.(css|scss|sass)$": "identity-obj-proxy", // Stub CSS modules
};
