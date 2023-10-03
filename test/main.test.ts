import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../src/PipelineStack';
import { InzageApiStack } from '../src/InzageApiStack';
import { Configuration } from '../src/Configuration';

const config: Configuration = {
  branchName: 'development',
  pipelineName: 'pipeline',
  pipelineStackCdkName: 'pipeline-stack',
  buildEnvironment: { account: 'test', region: 'eu-west-1' },
  deploymentEnvironment: { account: 'test', region: 'eu-west-1' },
}

test('Snapshot', () => {
  const app = new App();
  const stack = new PipelineStack(app, 'test', { env: { account: 'test', region: 'eu-west-1' }, configuration: config });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});


test('StackHasLambdas', () => {
  const app = new App();
  const stack = new InzageApiStack(app, 'api');
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::Lambda::Function', 2); //Setting log retention creates a lambda
});