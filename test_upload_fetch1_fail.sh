#!/bin/bash

# Definir constantes
BASE_URL="http://109.199.124.173:4000"
# BASE_URL="http://localhost:4000"
WALLET_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
NFT_CONTRACT="0x131a23869322794Ed8cB53b2Be92761e2a5ecbf1"  # El contrato esta mal
PATH_FILE_TO_UPLOAD="$PWD/wills/matias.json"


# Ejecutar primer sign-message y capturar la respuesta
echo "Obteniendo firma inicial para el upload..."
echo ""
response_a=$(curl -s -X POST "$BASE_URL/wallet/sign-message" \
  -H "Content-Type: application/json" \
  -d "{
    \"walletAddress\": \"$WALLET_ADDRESS\",
    \"privateKey\": \"$PRIVATE_KEY\"
  }")

a_signed=$(echo "$response_a" | jq -r '.signedMessage')
echo "Firma para upload obtenida: $a_signed"
echo ""
echo "Subiendo testamento..."
echo ""
upload_response=$(curl -s -X POST "$BASE_URL/will/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$PATH_FILE_TO_UPLOAD" \
  -F "walletAddress=$WALLET_ADDRESS" \
  -F "nftContractAddress=$NFT_CONTRACT" \
  -F "signedMessage=$a_signed")

echo "Respuesta de upload: $upload_response"
echo ""

# Ejecutar segundo sign-message
echo "Obteniendo segunda firma para la consulta..."
echo ""
response_b=$(curl -s -X POST "$BASE_URL/wallet/sign-message" \
  -H "Content-Type: application/json" \
  -d "{
    \"walletAddress\": \"$WALLET_ADDRESS\",
    \"privateKey\": \"$PRIVATE_KEY\"
  }")

b_signed=$(echo "$response_b" | jq -r '.signedMessage')
echo ""
echo "Firma para consulta obtenida: $b_signed"
echo ""

# Extraer CID
cid=$(echo "$upload_response" | jq -r '.cid')
echo "CID obtenido: $cid"
echo ""

# Recuperar testamento
echo "Recuperando testamento..."
echo ""
curl -X GET "$BASE_URL/will/$cid?walletAddress=$WALLET_ADDRESS&signedMessage=$b_signed" \
  -H "Content-Type: application/json"
