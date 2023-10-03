import { App } from 'aws-cdk-lib';
import * as Dotenv from 'dotenv';
import { getConfiguration } from './Configuration';
import { PipelineStack } from './PipelineStack';

Dotenv.config();
const app = new App();

const branchToBuild = process.env.BRANCH_NAME ?? 'acceptance';
console.log(`Branch to build: ${branchToBuild}`);
const configuration = getConfiguration(branchToBuild);

new PipelineStack(app, configuration.pipelineStackCdkName, {
  env: configuration.buildEnvironment,
  configuration: configuration,
});

app.synth();