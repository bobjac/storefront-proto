/**
 * Key Vault module.
 * Stores secrets for the AI search feature.
 */

@description('The location for the resource')
param location string

@description('Environment name')
param environmentName string

@description('Project name')
param projectName string

@description('Tags')
param tags object

@description('Azure OpenAI endpoint')
@secure()
param openaiEndpoint string

@description('Azure OpenAI API key')
@secure()
param openaiApiKey string

// Naming
var keyVaultName = 'kv-${projectName}-${environmentName}'

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    enablePurgeProtection: environmentName == 'prod'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// OpenAI Endpoint Secret
resource openaiEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'AZURE-OPENAI-ENDPOINT'
  properties: {
    value: openaiEndpoint
    contentType: 'text/plain'
  }
}

// OpenAI API Key Secret
resource openaiApiKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'AZURE-OPENAI-API-KEY'
  properties: {
    value: openaiApiKey
    contentType: 'text/plain'
  }
}

// Outputs
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
