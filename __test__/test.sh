#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3030"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Stock API Manual Test Script${NC}"
echo -e "${BLUE}================================================${NC}\n"

# Function to print test header
print_test() {
    echo -e "\n${YELLOW}>>> $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to make request and display response
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo -e "${BLUE}Request:${NC} $method $API_URL$endpoint"
    if [ ! -z "$data" ]; then
        echo -e "${BLUE}Data:${NC} $data"
    fi
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    # Extract status code (last line) and body (everything else)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo -e "${BLUE}Status:${NC} $status_code"
    echo -e "${BLUE}Response:${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    
    if [ "$status_code" == "$expected_status" ]; then
        print_success "Test passed (Expected $expected_status)"
    else
        print_error "Test failed (Expected $expected_status, got $status_code)"
    fi
}

# Wait for user input
wait_key() {
    echo -e "\n${YELLOW}Press Enter to continue...${NC}"
    read
}

# CT-001: Check if API is running
print_test "CT-000: Health Check - GET /"
make_request "GET" "/" "" "200"
wait_key

# CT-002: List empty stock
print_test "CT-002: List empty stock - GET /stock"
make_request "GET" "/stock" "" "200"
wait_key

# CT-003: Add product (positive)
print_test "CT-003: Add product - POST /stock"
make_request "POST" "/stock" '{
  "name": "Laptop Dell",
  "value": 3500.00,
  "quantity": 10
}' "201"
PRODUCT_ID_1=$(curl -s -X POST "$API_URL/stock" \
    -H "Content-Type: application/json" \
    -d '{"name":"Laptop Dell","value":3500.00,"quantity":10}' | jq -r '.id')
wait_key

# CT-003: Add another product
print_test "CT-003b: Add second product - POST /stock"
make_request "POST" "/stock" '{
  "name": "Mouse Logitech",
  "value": 150.50,
  "quantity": 25
}' "201"
PRODUCT_ID_2=$(curl -s -X POST "$API_URL/stock" \
    -H "Content-Type: application/json" \
    -d '{"name":"Mouse Logitech","value":150.50,"quantity":25}' | jq -r '.id')
wait_key

# CT-003: Add third product
print_test "CT-003c: Add third product - POST /stock"
make_request "POST" "/stock" '{
  "name": "Teclado Mecânico",
  "value": 450.00,
  "quantity": 15
}' "201"
wait_key

# CT-001: List stock with items
print_test "CT-001: List stock with items - GET /stock"
make_request "GET" "/stock" "" "200"
wait_key

# CT-008: Get product by ID (positive)
print_test "CT-008: Get product by ID - GET /stock/$PRODUCT_ID_1"
make_request "GET" "/stock/$PRODUCT_ID_1" "" "200"
wait_key

# CT-009: Get non-existent product (negative)
print_test "CT-009: Get non-existent product - GET /stock/999999"
make_request "GET" "/stock/999999" "" "404"
wait_key

# CT-020: Get product with invalid ID (negative)
print_test "CT-020: Get product with invalid ID - GET /stock/abc"
make_request "GET" "/stock/abc" "" "404"
wait_key

# CT-005: Update existing product (positive)
print_test "CT-005: Update product - PUT /stock/$PRODUCT_ID_1"
make_request "PUT" "/stock/$PRODUCT_ID_1" '{
  "value": 3200.00,
  "quantity": 8
}' "200"
wait_key

# CT-017: Update only quantity
print_test "CT-017: Update only quantity - PUT /stock/$PRODUCT_ID_2"
make_request "PUT" "/stock/$PRODUCT_ID_2" '{
  "quantity": 30
}' "200"
wait_key

# CT-006: Update non-existent product (negative)
print_test "CT-006: Update non-existent product - PUT /stock/999999"
make_request "PUT" "/stock/999999" '{
  "value": 1000.00
}' "404"
wait_key

# CT-004: Add product without name (negative)
print_test "CT-004: Add product without name - POST /stock"
make_request "POST" "/stock" '{
  "value": 500.00,
  "quantity": 5
}' "400"
wait_key

# CT-015: Add product with negative value
print_test "CT-015: Add product with negative value - POST /stock"
make_request "POST" "/stock" '{
  "name": "Produto Teste Negativo",
  "value": -100.00,
  "quantity": 1
}' "201"
wait_key

# CT-016: Add product with zero quantity
print_test "CT-016: Add product with zero quantity - POST /stock"
make_request "POST" "/stock" '{
  "name": "Produto Sem Estoque",
  "value": 250.00,
  "quantity": 0
}' "201"
wait_key

# List all products before deletion
print_test "List all products before deletion - GET /stock"
make_request "GET" "/stock" "" "200"
wait_key

# CT-007: Remove existing product (positive)
print_test "CT-007: Remove product - DELETE /stock/$PRODUCT_ID_1"
make_request "DELETE" "/stock/$PRODUCT_ID_1" "" "200"
wait_key

# CT-021: Remove already deleted product (negative)
print_test "CT-021: Remove already deleted product - DELETE /stock/$PRODUCT_ID_1"
make_request "DELETE" "/stock/$PRODUCT_ID_1" "" "404"
wait_key

# Final list
print_test "Final stock list - GET /stock"
make_request "GET" "/stock" "" "200"
wait_key

# Additional edge cases
print_test "Edge Case: Add product with missing value field"
make_request "POST" "/stock" '{
  "name": "Produto Incompleto",
  "quantity": 10
}' "400"
wait_key

print_test "Edge Case: Add product with missing quantity field"
make_request "POST" "/stock" '{
  "name": "Outro Produto Incompleto",
  "value": 100.00
}' "400"
wait_key

print_test "Edge Case: Send invalid JSON"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/stock" \
    -H "Content-Type: application/json" \
    -d '{invalid json}')
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo -e "${BLUE}Status:${NC} $status_code"
echo -e "${BLUE}Response:${NC}"
echo "$body"
wait_key

echo -e "\n${BLUE}================================================${NC}"
echo -e "${GREEN}  All manual tests completed!${NC}"
echo -e "${BLUE}================================================${NC}\n"
