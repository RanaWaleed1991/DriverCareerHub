#!/usr/bin/env bash
# deploy-auth.sh — Bootstrap and deploy the Cognito Auth CDK stack.
#
# Usage:
#   ./infrastructure/scripts/deploy-auth.sh [--region ap-southeast-2] [--profile myprofile]
#
# After deployment, copy the printed outputs into:
#   driver-career-hub/frontend/.env.local
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
STACK_NAME="DriverCareerHubAuthStack"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CDK_DIR="$(cd "${SCRIPT_DIR}/../cdk" && pwd)"

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

echo "==> Driver Career Hub — Cognito Auth Stack Deployment"
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
  --outputs-file /tmp/driver-career-hub-auth-outputs.json

# ─── Print .env.local values ─────────────────────────────────────────────────
echo ""
echo "============================================================"
echo " Deployment complete! Add these to frontend/.env.local:"
echo "============================================================"

if command -v jq &>/dev/null; then
  POOL_ID=$(jq -r ".${STACK_NAME}.UserPoolId" /tmp/driver-career-hub-auth-outputs.json)
  CLIENT_ID=$(jq -r ".${STACK_NAME}.UserPoolClientId" /tmp/driver-career-hub-auth-outputs.json)

  echo ""
  echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID=${POOL_ID}"
  echo "NEXT_PUBLIC_COGNITO_CLIENT_ID=${CLIENT_ID}"
  echo "NEXT_PUBLIC_COGNITO_REGION=${REGION}"
  echo ""
  echo "Outputs also saved to: /tmp/driver-career-hub-auth-outputs.json"
else
  echo ""
  echo "  (install jq for auto-parsed output)"
  echo "  Raw outputs: /tmp/driver-career-hub-auth-outputs.json"
  echo ""
  cat /tmp/driver-career-hub-auth-outputs.json
fi

echo "============================================================"
