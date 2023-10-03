const { GemeenteNijmegenCdkApp } = require('@gemeentenijmegen/projen-project-type');
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.41.0',
  defaultReleaseBranch: 'production',
  name: 'mijn-inzage',
  /* Runtime dependencies of this module */
  deps: [
    '@gemeentenijmegen/aws-constructs',
    '@gemeentenijmegen/apiclient',
    '@aws-sdk/client-dynamodb',
    'axios',
    '@gemeentenijmegen/utils',
    '@aws-sdk/client-secrets-manager',
    '@gemeentenijmegen/session',
    '@aws-cdk/aws-apigatewayv2-alpha',
    '@aws-cdk/aws-apigatewayv2-integrations-alpha',
    '@gemeentenijmegen/apiclient',
    '@gemeentenijmegen/utils',
    'mustache',
    'dotenv',
  ],
  devDeps: [
    '@gemeentenijmegen/projen-project-type',
    '@glen/jest-raw-loader',
    '@types/mustache',
  ],
  mutableBuild: true,
  jestOptions: {
    jestConfig: {
      setupFiles: ['dotenv/config'],
      moduleFileExtensions: [
        'js', 'json', 'jsx', 'ts', 'tsx', 'node', 'mustache',
      ],
      transform: {
        '\\.[jt]sx?$': 'ts-jest',
        '^.+\\.mustache$': '@glen/jest-raw-loader',
      },
      testPathIgnorePatterns: ['/node_modules/', '/cdk.out', '/test/playwright'],
      roots: ['src', 'test'],
    },
  },
  eslintOptions: {
    devdirs: ['src/app/persoonsgegevens/tests', '/test', '/build-tools'],
  },
  bundlerOptions: {
    loaders: {
      mustache: 'text',
    },
  },
  gitignore: [
    '.env',
    '.vscode',
    '.DS_Store',
    'src/app/**/tests/output',
  ],
});
project.synth();