module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
setupFiles: ['<rootDir>/tests/setupJest.ts'],
collectCoverage: true,
collectCoverageFrom: ['src/**/*.ts']
};