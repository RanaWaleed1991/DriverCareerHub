#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthStack } from "../lib/auth-stack";

const app = new cdk.App();

new AuthStack(app, "DriverCareerHubAuthStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "ap-southeast-2",
  },
  description:
    "Driver Career Hub — Cognito User Pool and App Client for driver authentication (Melbourne PWA)",
});
