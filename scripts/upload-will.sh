#!/bin/bash

BASE_URL="http://109.199.124.173:4000"
WALLET_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
NFT_CONTRACT="0x131a23869322794Ed8cB53b2Be92761e2a5ecbf1"
PATH_FILE_TO_UPLOAD="$PWD/../wills/matias.json"

if [ ! -f "$PATH_FILE_TO_UPLOAD" ]; then
  echo "Error: El archivo '$PATH_FILE_TO_UPLOAD' no existe."
  exit 1
fi

# Obtener firma
signed_message=$(./sign-message.sh)

if [ -z "$signed_message" ] || [ "$signed_message" == "null" ]; then
  echo "Error: No se pudo obtener la firma."
  exit 1
fi

echo "Subiendo testamento..."
upload_response=$(curl -s -X POST "$BASE_URL/will/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$PATH_FILE_TO_UPLOAD" \
  -F "walletAddress=$WALLET_ADDRESS" \
  -F "nftContractAddress=$NFT_CONTRACT" \
  -F "signedMessage=$signed_message")

cid=$(echo "$upload_response" | jq -r '.cid')

if [ -z "$cid" ] || [ "$cid" == "null" ]; then
  echo "Error: No se pudo obtener el CID."
  exit 1
fi

echo "CID obtenido: $cid"
echo "$cid" > last_cid.txt  # Guardamos el CID para usarlo en la recuperación.
