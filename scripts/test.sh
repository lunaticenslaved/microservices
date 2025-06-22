TEMP_FILE="./tmp.json"

cat > "${TEMP_FILE}" << EOF
{
  "command": "food/product/create",
  "data": {}
}
EOF

curl \
  http://localhost:4000/command \
  --request POST \
  --header "Content-Type: application/json" \
  --data "@${TEMP_FILE}"

rm "${TEMP_FILE}"
