import { Statics } from './statics';

export interface Environment {
  account: string;
  region: string;
}

export interface Configurable {
  configuration: Configuration;
}

export interface Configuration {
  branchName: string;
  buildEnvironment: Environment;
  deploymentEnvironment: Environment;
  pipelineName: string;
  pipelineStackCdkName: string;
}

const configurations: { [key: string]: Configuration } = {
  acceptance: {
    branchName: 'acceptance',
    buildEnvironment: Statics.gnBuildEnvironment,
    deploymentEnvironment: Statics.gnMijnNijmegenAccpEnvironment,
    pipelineStackCdkName: 'mijninzage-pipeline-acceptance',
    pipelineName: 'mijninzage-acceptance',
  },
  production: {
    branchName: 'production',
    buildEnvironment: Statics.gnBuildEnvironment,
    deploymentEnvironment: Statics.gnMijnNijmegenProdEnvironment,
    pipelineStackCdkName: 'mijninzage-pipeline-production',
    pipelineName: 'mijninzage-production',
  },
};

export function getConfiguration(branchName: string) {
  const config = configurations[branchName];
  if (!config) {
    throw new Error(`Configuration for branch ${branchName} not found`);
  }
  return config;
}