import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpRouteKey } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { aws_secretsmanager, Stack, aws_ssm as SSM, aws_kms } from 'aws-cdk-lib';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { ApiFunction } from './ApiFunction';
import { InzageFunction } from './app/inzage/inzage-function';
import { Statics } from './statics';

export class InzageApiStack extends Stack {
  private sessionsTable: ITable;
  private api: apigatewayv2.IHttpApi;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const sessionsTableArn = SSM.StringParameter.fromStringParameterName(this, 'sessions-table-arn', Statics.ssmSessionsTableArn).stringValue;
    const keyArn = SSM.StringParameter.fromStringParameterName(this, 'key-arn', Statics.ssmDataKeyArn).stringValue;

    /**
     * Use fromTableAttributes so we can pass in the encryption key. This
     * way the table.grantReadWriteData() call actually sets the correct
     * KMS policy fields (kms:Encrypt etc.)
     */
    this.sessionsTable = Table.fromTableAttributes(this, 'sessionstable', {
      encryptionKey: aws_kms.Key.fromKeyArn(this, 'data-key', keyArn),
      tableArn: sessionsTableArn,
    });

    const apiGatewayId = SSM.StringParameter.fromStringParameterName(this, 'gatewayid', Statics.ssmApiGatewayId);
    this.api = apigatewayv2.HttpApi.fromHttpApiAttributes(this, 'apigateway', { httpApiId: apiGatewayId.stringValue });
    this.setFunctions();
  }

  /**
   * Create and configure lambda's for all api routes, and
   * add routes to the gateway.
   * @param {string} baseUrl the application url
   */
  setFunctions() {

    const secretMTLSPrivateKey = aws_secretsmanager.Secret.fromSecretNameV2(this, 'tls-key-secret', Statics.secretMTLSPrivateKey);
    const inzageApiKey = aws_secretsmanager.Secret.fromSecretNameV2(this, 'api-key-secret', Statics.ssmInzageApiKey);
    const tlskeyParam = SSM.StringParameter.fromStringParameterName(this, 'tlskey', Statics.ssmMTLSClientCert);
    const tlsRootCAParam = SSM.StringParameter.fromStringParameterName(this, 'tlsrootca', Statics.ssmMTLSRootCA);

    const monitoringLambdaArn = SSM.StringParameter.valueForStringParameter(this, Statics.ssmMonitoringLambdaArn);
    const monitoringFunction = Function.fromFunctionAttributes(this, 'monitoring', {
      functionArn: monitoringLambdaArn,
      sameEnvironment: true,
    });

    const readOnlyRole = Role.fromRoleArn(this, 'readonly', SSM.StringParameter.valueForStringParameter(this, Statics.ssmReadOnlyRoleArn));

    const inzageFunction = new ApiFunction(this, 'inzage-function', {
      description: 'Inzage-lambda voor de Mijn Nijmegen-applicatie.',
      codePath: 'app/inzage',
      table: this.sessionsTable,
      tablePermissions: 'ReadWrite',
      environment: {
        MTLS_PRIVATE_KEY_ARN: secretMTLSPrivateKey.secretArn,
        MTLS_CLIENT_CERT_NAME: Statics.ssmMTLSClientCert,
        MTLS_ROOT_CA_NAME: Statics.ssmMTLSRootCA,
        BRP_API_URL: SSM.StringParameter.valueForStringParameter(this, Statics.ssmBrpApiEndpointUrl),
        INZAGE_BASE_URL: SSM.StringParameter.valueForStringParameter(this, Statics.ssmInzageApiEndpointUrl),
        INZAGE_API_KEY_ARN: inzageApiKey.secretArn,
      },
      monitoredBy: monitoringFunction,
      apiFunction: InzageFunction,
      readOnlyRole: readOnlyRole,
    });
    secretMTLSPrivateKey.grantRead(inzageFunction.lambda);
    inzageApiKey.grantRead(inzageFunction.lambda);
    tlskeyParam.grantRead(inzageFunction.lambda);
    tlsRootCAParam.grantRead(inzageFunction.lambda);

    new apigatewayv2.HttpRoute(this, 'inzage-route', {
      httpApi: this.api,
      integration: new HttpLambdaIntegration('inzage', inzageFunction.lambda),
      routeKey: HttpRouteKey.with('/inzage', apigatewayv2.HttpMethod.GET),
    });
  }
}