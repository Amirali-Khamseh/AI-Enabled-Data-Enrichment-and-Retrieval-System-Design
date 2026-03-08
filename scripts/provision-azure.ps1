# ============================================================
# Azure Resource Provisioning Script
# Prerequisites: Azure CLI installed + logged in (run: az login)
# ============================================================

# ---------- CONFIGURE THESE ----------
$RESOURCE_GROUP   = "thesis-hybrid-search-rg"
$LOCATION         = "swedencentral"       
$STORAGE_ACCOUNT  = "thesishybsearchstorage"  
$SEARCH_SERVICE   = "thesis-hybrid-search-ai-search" 
$OPENAI_ACCOUNT   = "thesis-hybrid-search-openai"    
$CONTAINER_NAME   = "thesis-hybrid-search-subjects"
$SEARCH_INDEX     = "thesis-hybrid-search-index"
# --------------------------------------

Write-Host "`n=== Step 1: Create Resource Group ===" -ForegroundColor Cyan
az group create --name $RESOURCE_GROUP --location $LOCATION

Write-Host "`n=== Step 2: Create Storage Account ===" -ForegroundColor Cyan
az storage account create `
  --name $STORAGE_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --sku Standard_LRS `
  --kind StorageV2

# Get connection string
$STORAGE_CONN_STR = az storage account show-connection-string `
  --name $STORAGE_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --query connectionString -o tsv

# Create blob container
az storage container create `
  --name $CONTAINER_NAME `
  --connection-string $STORAGE_CONN_STR

Write-Host "`n=== Step 3: Create Azure AI Search ===" -ForegroundColor Cyan
az search service create `
  --name $SEARCH_SERVICE `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --sku basic `
  --partition-count 1 `
  --replica-count 1

# Get search admin key
$SEARCH_KEY = az search admin-key show `
  --service-name $SEARCH_SERVICE `
  --resource-group $RESOURCE_GROUP `
  --query primaryKey -o tsv

$SEARCH_ENDPOINT = "https://$SEARCH_SERVICE.search.windows.net"

Write-Host "`n=== Step 4: Create Azure OpenAI ===" -ForegroundColor Cyan
az cognitiveservices account create `
  --name $OPENAI_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --kind OpenAI `
  --sku S0 `
  --custom-domain $OPENAI_ACCOUNT

# Get OpenAI key
$OPENAI_KEY = az cognitiveservices account keys list `
  --name $OPENAI_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --query key1 -o tsv

$OPENAI_ENDPOINT = "https://$OPENAI_ACCOUNT.openai.azure.com"

Write-Host "`n=== Step 5: Deploy OpenAI Models ===" -ForegroundColor Cyan

# Deploy embedding model
az cognitiveservices account deployment create `
  --name $OPENAI_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --deployment-name "text-embedding-ada-002" `
  --model-name "text-embedding-ada-002" `
  --model-version "2" `
  --model-format OpenAI `
  --sku-capacity 120 `
  --sku-name Standard

# Deploy chat model
az cognitiveservices account deployment create `
  --name $OPENAI_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --deployment-name "gpt-4o" `
  --model-name "gpt-4o" `
  --model-version "2024-11-20" `
  --model-format OpenAI `
  --sku-capacity 80 `
  --sku-name GlobalStandard

# ============================================================
Write-Host "`n`n========================================" -ForegroundColor Green
Write-Host "  ALL RESOURCES CREATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Add these to your .env.local:`n" -ForegroundColor Yellow

Write-Host @"
# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONN_STR
AZURE_STORAGE_CONTAINER_NAME=$CONTAINER_NAME

# Azure AI Search
AZURE_SEARCH_ENDPOINT=$SEARCH_ENDPOINT
AZURE_SEARCH_ADMIN_KEY=$SEARCH_KEY
AZURE_SEARCH_INDEX_NAME=$SEARCH_INDEX

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT
AZURE_OPENAI_API_KEY=$OPENAI_KEY
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-ada-002
AZURE_OPENAI_API_VERSION=2024-12-01-preview
"@

Write-Host "`n========================================`n" -ForegroundColor Green

# Also write it to .env.local automatically
$envContent = @"
# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONN_STR
AZURE_STORAGE_CONTAINER_NAME=$CONTAINER_NAME

# Azure AI Search
AZURE_SEARCH_ENDPOINT=$SEARCH_ENDPOINT
AZURE_SEARCH_ADMIN_KEY=$SEARCH_KEY
AZURE_SEARCH_INDEX_NAME=$SEARCH_INDEX

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT
AZURE_OPENAI_API_KEY=$OPENAI_KEY
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-ada-002
AZURE_OPENAI_API_VERSION=2024-12-01-preview
"@

$envPath = Join-Path $PSScriptRoot "..\.env.local"
if (Test-Path $envPath) {
    Add-Content -Path $envPath -Value "`n$envContent"
    Write-Host "Appended Azure credentials to .env.local" -ForegroundColor Green
} else {
    Set-Content -Path $envPath -Value $envContent
    Write-Host "Created .env.local with Azure credentials" -ForegroundColor Green
}
