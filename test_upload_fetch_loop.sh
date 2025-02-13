#!/bin/bash

# Definir la URL base
# BASE_URL="http://109.199.124.173:4000"
BASE_URL="http://109.199.124.173:4000"

# Definir arrays con las cuentas y llaves privadas
declare -a WALLETS=(
    "0x9eF6c02FB2ECc446146E05F1fF687a788a8BF76d"
    "0x08A2DE6F3528319123b25935C92888B16db8913E"
    "0xe141C82D99D85098e03E1a1cC1CdE676556fDdE0"
    "0x4b23D303D9e3719D6CDf8d172Ea030F80509ea15"
    "0xC004e69C5C04A223463Ff32042dd36DabF63A25a"
    "0x5eb15C0992734B5e77c888D713b4FC67b3D679A2"
    "0x7Ebb637fd68c523613bE51aad27C35C4DB199B9c"
    "0x3c3E2E178C69D4baD964568415a0f0c84fd6320A"
    "0x35304262b9E87C00c430149f28dD154995d01207"
    "0xD4A1E660C916855229e1712090CcfD8a424A2E33"
)

declare -a PRIVATE_KEYS=(
    "0xc95eaed402c8bd203ba04d81b35509f17d0719e3f71f40061a2ec2889bc4caa7"
    "0x55afe0ab59c1f7bbd00d5531ddb834c3c0d289a4ff8f318e498cb3f004db0b53"
    "0xc3f9b30f83d660231203f8395762fa4257fa7db32039f739630f87b8836552cc"
    "0x3db34a7bcc6424e7eadb8e290ce6b3e1423c6e3ef482dd890a812cd3c12bbede"
    "0xae2daaa1ce8a70e510243a77187d2bc8da63f0186074e4a4e3a7bfae7fa0d639"
    "0x5ea5c783b615eb12be1afd2bdd9d96fae56dda0efe894da77286501fd56bac64"
    "0xf702e0ff916a5a76aaf953de7583d128c013e7f13ecee5d701b49917361c5e90"
    "0x7ec49efc632757533404c2139a55b4d60d565105ca930a58709a1c52d86cf5d3"
    "0x755e273950f5ae64f02096ae99fe7d4f478a28afd39ef2422068ee7304c636c0"
    "0xaf6ecabcdbbfb2aefa8248b19d811234cd95caa51b8e59b6ffd3d4bbc2a6be4c"
)

NFT_CONTRACT="0x131a23869322794Ed8cB53b2Be92761e2a5ecbf5"
PATH_FILE_TO_UPLOAD="$PWD/wills/matias.json"

# Iterar sobre cada cuenta
for ((i=0; i<${#WALLETS[@]}; i++)); do
    echo "Procesando cuenta $((i+1))/${#WALLETS[@]}"
    echo "===================="
    
    WALLET_ADDRESS=${WALLETS[$i]}
    PRIVATE_KEY=${PRIVATE_KEYS[$i]}

    # Primer sign-message
    echo "Obteniendo firma inicial..."
    response_a=$(curl -s -X POST "$BASE_URL/wallet/sign-message" \
      -H "Content-Type: application/json" \
      -d "{\"walletAddress\": \"$WALLET_ADDRESS\", \"privateKey\": \"$PRIVATE_KEY\"}")
    
    sign_for_upload=$(echo "$response_a" | jq -r '.signedMessage')
    echo "Firma obtenida: $sign_for_upload"
    echo ""
    
    # Upload
    echo "Subiendo testamento..."
    upload_response=$(curl -s -X POST "$BASE_URL/will/upload" \
      -H "Content-Type: multipart/form-data" \
      -F "file=@$PATH_FILE_TO_UPLOAD" \
      -F "walletAddress=$WALLET_ADDRESS" \
      -F "nftContractAddress=$NFT_CONTRACT" \
      -F "signedMessage=$sign_for_upload")
    
    echo "Respuesta de upload: $upload_response"
    echo ""
    
    # Segundo sign-message
    echo "Obteniendo segunda firma..."
    response_b=$(curl -s -X POST "$BASE_URL/wallet/sign-message" \
      -H "Content-Type: application/json" \
      -d "{\"walletAddress\": \"$WALLET_ADDRESS\", \"privateKey\": \"$PRIVATE_KEY\"}")
    
    sign_for_download=$(echo "$response_b" | jq -r '.signedMessage')
    echo "Segunda firma obtenida: $sign_for_download"
    echo ""
    
    # Extraer CID
    cid=$(echo "$upload_response" | jq -r '.cid')
    
    # Recuperar testamento
    echo "Recuperando testamento para cuenta $((i+1))..."
    curl -X GET "$BASE_URL/will/$cid?walletAddress=$WALLET_ADDRESS&signedMessage=$sign_for_download" \
      -H "Content-Type: application/json"
    
    echo ""
    echo "======================================"
    echo ""
done
