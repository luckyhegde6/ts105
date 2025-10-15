module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
setupFiles: ['<rootDir>/tests/setupJest.ts'],
collectCoverage: true,
collectCoverageFrom: ['src/**/*.ts'],
coverageDirectory: 'coverage',
coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
testMatch: ['**/tests/**/*.spec.ts']
};