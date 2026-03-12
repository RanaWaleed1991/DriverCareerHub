#!/usr/bin/env bash
# deploy-storage.sh — Bootstrap and deploy the S3 Storage CDK stack.
#
# Usage:
#   ./infrastructure/scripts/deploy-storage.sh [--region ap-southeast-2] [--profile myprofile]
#
# After deployment, copy the printed BucketName into:
#   driver-career-hub/frontend/.env.local  →  NEXT_PUBLIC_S3_BUCKET=<value>
#
# Also attach the BackendS3PolicyArn output to the IAM user/role used by FastAPI on Railway.
#
# Prerequisites:
#   - AWS CLI configured (aws configure) or IAM role attached to the runner
#   - Node.js 18+ installed
#   - AWS CDK bootstrap already run for your account/region:
#       npx cdk bootstrap aws://ACCOUNT_ID/REGION
#
set -euo pipefail

# ─── Defaults ────────────────────────────────────────────────────────────────
REGION="${CDK_DEFAULT_REGION:-ap-southeast-2}"
PROFILE=""
STACK_NAME="DriverCareerHubStorageStack"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CDK_DIR="$(cd "${SCRIPT_DIR}/../cdk" && pwd)"
OUTPUTS_FILE="/tmp/driver-career-hub-storage-outputs.json"

# ─── Parse args ──────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --region)
      REGION="$2"; shift 2 ;;
    --profile)
      PROFILE="$2"; shift 2 ;;
    *)
      echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

PROFILE_ARG=""
if [[ -n "$PROFILE" ]]; then
  PROFILE_ARG="--profile ${PROFILE}"
fi

echo "==> Driver Career Hub — S3 Storage Stack Deployment"
echo "    Stack:  ${STACK_NAME}"
echo "    Region: ${REGION}"
echo "    Dir:    ${CDK_DIR}"
echo ""

# ─── Install dependencies ─────────────────────────────────────────────────────
echo "==> Installing CDK dependencies..."
cd "${CDK_DIR}"
npm install

# ─── Deploy ──────────────────────────────────────────────────────────────────
echo ""
echo "==> Deploying ${STACK_NAME}..."
npx cdk deploy "${STACK_NAME}" \
  --require-approval never \
  --region "${REGION}" \
  ${PROFILE_ARG} \
  --outputs-file "${OUTPUTS_FILE}"

# ─── Print .env.local values ─────────────────────────────────────────────────
echo ""
echo "============================================================"
echo " Deployment complete!"
echo "============================================================"

if command -v jq &>/dev/null; then
  BUCKET_NAME=$(jq -r ".${STACK_NAME}.BucketName" "${OUTPUTS_FILE}")
  BUCKET_ARN=$(jq -r ".${STACK_NAME}.BucketArn" "${OUTPUTS_FILE}")
  BACKEND_POLICY_ARN=$(jq -r ".${STACK_NAME}.BackendPolicyArn" "${OUTPUTS_FILE}")
  FRONTEND_POLICY_ARN=$(jq -r ".${STACK_NAME}.FrontendUploadPolicyArn" "${OUTPUTS_FILE}")

  echo ""
  echo " 1. Add to frontend/.env.local:"
  echo "    NEXT_PUBLIC_S3_BUCKET=${BUCKET_NAME}"
  echo ""
  echo " 2. Attach this policy to your FastAPI IAM user/role on Railway:"
  echo "    ${BACKEND_POLICY_ARN}"
  echo ""
  echo " 3. (Optional) Attach this policy to Cognito Identity Pool auth role:"
  echo "    ${FRONTEND_POLICY_ARN}"
  echo ""
  echo " Bucket ARN: ${BUCKET_ARN}"
  echo " Outputs saved to: ${OUTPUTS_FILE}"
else
  echo ""
  echo "  (install jq for auto-parsed output)"
  echo "  Raw outputs: ${OUTPUTS_FILE}"
  echo ""
  cat "${OUTPUTS_FILE}"
fi

echo "============================================================"
