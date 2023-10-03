export abstract class Statics {
  static readonly projectName: string = 'mijn-inzage';

  /**
   * Imported arns from Mijn Nijmegen
   */
  static readonly ssmApiGatewayId: string = '/cdk/mijn-nijmegen/apigateway-id';
  static readonly ssmSessionsTableArn: string = '/cdk/mijn-nijmegen/sessionstable-arn';
  static readonly ssmDataKeyArn: string = '/cdk/mijn-nijmegen/kms-datakey-arn';
  static readonly ssmMonitoringLambdaArn: string = '/cdk/mijn-nijmegen/monitoring-lambda-arn';
  static readonly ssmReadOnlyRoleArn: string = '/cdk/mijn-nijmegen/role-readonly-arn';

  /**
   * Certificate private key for mTLS
   */
  static readonly secretMTLSPrivateKey: string = '/cdk/mijn-gegevens/mtls-privatekey';

  /**
   * Certificate for mTLS
   */
  static readonly ssmMTLSClientCert: string = '/cdk/mijn-gegevens/mtls-clientcert';

  /**
    * Root CA for mTLS (PKIO root)
    */
  static readonly ssmMTLSRootCA: string = '/cdk/mijn-gegevens/mtls-rootca';

  /**
   * BRP API endpoint
   */
  static readonly ssmBrpApiEndpointUrl: string = '/cdk/mijn-gegevens/brp-api-url';

  /**
   * Inzage API endpoint
   */
  static readonly ssmInzageApiEndpointUrl: string = '/cdk/mijn-inzage/inzage-api-url';

  /**
     * Inzage API key
     */
  static readonly ssmInzageApiKey: string = '/cdk/mijn-inzage/inzage-api-key';

  // ENVIRONMENTS

  static readonly gnBuildEnvironment = {
    account: '836443378780',
    region: 'eu-central-1',
  };

  static readonly gnMijnNijmegenAccpEnvironment = {
    account: '021929636313',
    region: 'eu-central-1',
  };

  static readonly gnMijnNijmegenProdEnvironment = {
    account: '740606269759',
    region: 'eu-central-1',
  };

}