import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

/**
 * AuthStack — provisions Cognito User Pool + App Client for Driver Career Hub.
 *
 * Outputs (needed for .env.local):
 *   NEXT_PUBLIC_COGNITO_USER_POOL_ID  → UserPoolId
 *   NEXT_PUBLIC_COGNITO_CLIENT_ID     → UserPoolClientId
 *   NEXT_PUBLIC_COGNITO_REGION        → Region
 */
export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ─── Cognito User Pool ────────────────────────────────────────────────────

    this.userPool = new cognito.UserPool(this, "DriverUserPool", {
      userPoolName: "driver-career-hub-users",

      // Self sign-up
      selfSignUpEnabled: true,

      // Sign-in: email is the primary identifier
      signInAliases: {
        email: true,
      },
      signInCaseSensitive: false,

      // Standard attributes — email and name are required
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: true,
          mutable: true,
        },
      },

      // Custom attributes for driver-specific profile data
      customAttributes: {
        driver_platforms: new cognito.StringAttribute({
          mutable: true,
          minLen: 0,
          maxLen: 256,
        }),
        experience_years: new cognito.NumberAttribute({
          mutable: true,
          min: 0,
          max: 99,
        }),
      },

      // Email verification — required, uses Cognito default sender for MVP
      autoVerify: {
        email: true,
      },
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
        emailSubject: "Verify your Driver Career Hub account",
        emailBody:
          "Thanks for joining Driver Career Hub! Your verification code is {####}",
      },

      // Password policy: min 8 chars, lowercase + digit required
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false,
        tempPasswordValidity: cdk.Duration.days(7),
      },

      // Account recovery via email only
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

      // MFA — off for MVP; can enable later
      mfa: cognito.Mfa.OFF,

      // Keep users around when pool is destroyed in dev — switch to RETAIN for prod
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ─── Cognito User Pool App Client ─────────────────────────────────────────

    this.userPoolClient = new cognito.UserPoolClient(
      this,
      "DriverUserPoolClient",
      {
        userPool: this.userPool,
        userPoolClientName: "driver-career-hub-web",

        // Public SPA — no secret
        generateSecret: false,

        // Supported auth flows
        authFlows: {
          userSrp: true, // ALLOW_USER_SRP_AUTH (recommended, password never sent in plain text)
          userPassword: true, // ALLOW_USER_PASSWORD_AUTH (needed for server-side flows / testing)
          // refreshToken is always enabled by default in current aws-cdk-lib versions
        },

        // Token validity
        accessTokenValidity: cdk.Duration.hours(1),
        idTokenValidity: cdk.Duration.hours(1),
        refreshTokenValidity: cdk.Duration.days(30),

        // No OAuth/hosted UI needed for MVP — direct Cognito SDK integration
        oAuth: {
          flows: {
            authorizationCodeGrant: false,
            implicitCodeGrant: false,
          },
          scopes: [],
        },

        // Prevent user existence errors leaking from auth responses
        preventUserExistenceErrors: true,

        // Enable token revocation so refresh tokens can be invalidated on sign-out
        enableTokenRevocation: true,
      }
    );

    // ─── CloudFormation Outputs ───────────────────────────────────────────────
    // Copy these values into frontend/.env.local after deployment.

    new cdk.CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
      description: "Cognito User Pool ID → NEXT_PUBLIC_COGNITO_USER_POOL_ID",
      exportName: "DriverCareerHub-UserPoolId",
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
      description:
        "Cognito User Pool Client ID → NEXT_PUBLIC_COGNITO_CLIENT_ID",
      exportName: "DriverCareerHub-UserPoolClientId",
    });

    new cdk.CfnOutput(this, "Region", {
      value: this.region,
      description: "AWS Region → NEXT_PUBLIC_COGNITO_REGION",
      exportName: "DriverCareerHub-Region",
    });

    new cdk.CfnOutput(this, "UserPoolArn", {
      value: this.userPool.userPoolArn,
      description: "Cognito User Pool ARN (for backend IAM policies)",
      exportName: "DriverCareerHub-UserPoolArn",
    });

    // ─── Stack tags ───────────────────────────────────────────────────────────

    cdk.Tags.of(this).add("Project", "DriverCareerHub");
    cdk.Tags.of(this).add("Environment", "production");
    cdk.Tags.of(this).add("ManagedBy", "cdk");
  }
}
