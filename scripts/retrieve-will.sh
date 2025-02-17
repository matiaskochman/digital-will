#!/bin/bash

BASE_URL="http://109.199.124.173:4000"
WALLET_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

if [ ! -f "last_cid.txt" ]; then
  echo "Error: No se encontró el archivo 'last_cid.txt' con el CID."
  exit 1
fi

cid=$(cat last_cid.txt)

# Obtener firma
signed_message=$(./sign-message.sh)

if [ -z "$signed_message" ] || [ "$signed_message" == "null" ]; then
  echo "Error: No se pudo obtener la firma."
  exit 1
fi

echo "Recuperando testamento con CID: $cid..."
curl -X GET "$BASE_URL/will/$cid?walletAddress=$WALLET_ADDRESS&signedMessage=$signed_message" \
  -H "Content-Type: application/json"
