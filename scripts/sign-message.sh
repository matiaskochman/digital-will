#!/bin/bash

BASE_URL="http://109.199.124.173:4000"
WALLET_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

echo "Obteniendo firma..."
response=$(curl -s -X POST "$BASE_URL/wallet/sign-message" \
  -H "Content-Type: application/json" \
  -d "{
    \"walletAddress\": \"$WALLET_ADDRESS\",
    \"privateKey\": \"$PRIVATE_KEY\"
  }")

signed_message=$(echo "$response" | jq -r '.signedMessage')
echo "$signed_message"
