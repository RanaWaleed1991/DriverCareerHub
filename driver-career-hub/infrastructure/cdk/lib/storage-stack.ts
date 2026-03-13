import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

/**
 * StorageStack — provisions the S3 media bucket for Driver Career Hub.
 *
 * Bucket key-prefix conventions (logical folders):
 *   profiles/{user_id}/avatar.{ext}       — user profile photos
 *   posts/{post_id}/{filename}             — community post images
 *   marketplace/{listing_id}/{filename}    — marketplace listings (Phase 2)
 *
 * IAM policy documents are created as outputs so the FastAPI backend
 * (Railway) and future Lambda functions can assume scoped permissions.
 *
 * Outputs (needed for .env.local and backend config):
 *   NEXT_PUBLIC_S3_BUCKET  → BucketName
 *   (internal use)         → BucketArn, Region
 */
export class StorageStack extends cdk.Stack {
  public readonly mediaBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ─── S3 Media Bucket ──────────────────────────────────────────────────────

    this.mediaBucket = new s3.Bucket(this, "MediaBucket", {
      // Auto-generated name with readable prefix
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,

      // Security: block all public access — all reads go through presigned URLs
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,

      // Encryption at rest using S3-managed keys (SSE-S3)
      encryption: s3.BucketEncryption.S3_MANAGED,

      // CORS: allows the browser to PUT directly via presigned URLs
      // and GET files (e.g. previewing after upload).
      // Restrict allowedOrigins to your Amplify domain before production launch.
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ["*"], // TODO: lock down to Amplify domain pre-launch
          allowedHeaders: ["*"],
          exposedHeaders: ["ETag"],
          maxAge: 3000,
        },
      ],

      // Lifecycle: move objects to Infrequent Access after 90 days (cost saving)
      lifecycleRules: [
        {
          id: "transition-to-ia-after-90-days",
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(90),
            },
          ],
        },
      ],

      // Versioning off for MVP — enable before production if needed
      versioned: false,

      // Retain bucket on stack destroy to prevent accidental data loss.
      // Change to DESTROY only in a dedicated test environment.
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // ─── IAM Policy: Backend (FastAPI on Railway) ─────────────────────────────
    // Full CRUD — FastAPI signs presigned URLs, serves uploads, deletes old files.

    const backendPolicy = new iam.ManagedPolicy(this, "BackendS3Policy", {
      managedPolicyName: "dch-backend-s3-policy",
      description:
        "Driver Career Hub — FastAPI backend full CRUD on media bucket",
      document: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            sid: "BackendBucketCRUD",
            effect: iam.Effect.ALLOW,
            actions: [
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
              "s3:ListBucket",
            ],
            resources: [
              this.mediaBucket.bucketArn,
              `${this.mediaBucket.bucketArn}/*`,
            ],
          }),
        ],
      }),
    });

    // ─── IAM Policy: Frontend presigned URL upload (scoped) ───────────────────
    // Frontend never calls S3 directly — it calls FastAPI, which generates a
    // presigned PutObject URL. This policy is for documentation / future use
    // if you ever generate presigned URLs client-side via Cognito Identity Pool.

    const frontendUploadPolicy = new iam.ManagedPolicy(
      this,
      "FrontendUploadPolicy",
      {
        managedPolicyName: "dch-frontend-upload-s3-policy",
        description:
          "Driver Career Hub — frontend presigned upload only (PutObject)",
        document: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              sid: "FrontendPresignedUploadOnly",
              effect: iam.Effect.ALLOW,
              actions: ["s3:PutObject"],
              resources: [`${this.mediaBucket.bucketArn}/*`],
            }),
          ],
        }),
      }
    );

    // ─── CloudFormation Outputs ───────────────────────────────────────────────

    new cdk.CfnOutput(this, "BucketName", {
      value: this.mediaBucket.bucketName,
      description: "S3 media bucket name → NEXT_PUBLIC_S3_BUCKET",
      exportName: "DriverCareerHub-MediaBucketName",
    });

    new cdk.CfnOutput(this, "BucketArn", {
      value: this.mediaBucket.bucketArn,
      description: "S3 media bucket ARN (for backend IAM role attachments)",
      exportName: "DriverCareerHub-MediaBucketArn",
    });

    new cdk.CfnOutput(this, "Region", {
      value: this.region,
      description: "AWS Region where bucket is deployed",
      exportName: "DriverCareerHub-StorageRegion",
    });

    new cdk.CfnOutput(this, "BackendPolicyArn", {
      value: backendPolicy.managedPolicyArn,
      description:
        "Attach this policy ARN to the FastAPI IAM user/role on Railway",
      exportName: "DriverCareerHub-BackendS3PolicyArn",
    });

    new cdk.CfnOutput(this, "FrontendUploadPolicyArn", {
      value: frontendUploadPolicy.managedPolicyArn,
      description:
        "Attach to Cognito Identity Pool authenticated role (if using direct presigned URLs)",
      exportName: "DriverCareerHub-FrontendUploadPolicyArn",
    });

    // ─── Stack tags ───────────────────────────────────────────────────────────

    cdk.Tags.of(this).add("Project", "DriverCareerHub");
    cdk.Tags.of(this).add("Environment", "production");
    cdk.Tags.of(this).add("ManagedBy", "cdk");
  }
}
