#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthStack } from "../lib/auth-stack";
import { StorageStack } from "../lib/storage-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "ap-southeast-2",
};

new AuthStack(app, "DriverCareerHubAuthStack", {
  env,
  description:
    "Driver Career Hub — Cognito User Pool and App Client for driver authentication (Melbourne PWA)",
});

new StorageStack(app, "DriverCareerHubStorageStack", {
  env,
  description:
    "Driver Career Hub — S3 media bucket for profile photos, post images, and marketplace listings",
});
