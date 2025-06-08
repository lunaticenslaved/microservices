TEMP_FILE="./tmp.json"

cat > "${TEMP_FILE}" << EOF
{
    "message": "
service: food\n
action: product/create
"
}
EOF

curl \
  http://localhost:4001/message \
  --request POST \
  --header "Content-Type: application/json" \
  --data "@${TEMP_FILE}"

rm "${TEMP_FILE}"
