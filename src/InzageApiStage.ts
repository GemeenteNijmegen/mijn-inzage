import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { InzageApiStack } from './InzageApiStack';

export interface InzageApiStageProps extends StageProps, Configurable {}

/**
 * Stage responsible for the API Gateway and lambdas
 */
export class InzageApiStage extends Stage {
  constructor(scope: Construct, id: string, props: InzageApiStageProps) {
    super(scope, id, props);

    new InzageApiStack(this, 'inzage-api');
  }
}