/**
 * Main Bicep template for AI Search infrastructure.
 * Deploys Azure OpenAI, Key Vault, and monitoring resources.
 */

targetScope = 'subscription'

@description('The location for all resources')
param location string = 'eastus2'

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environmentName string = 'dev'

@description('The name of the project')
param projectName string = 'storefront-ai'

@description('Tags to apply to all resources')
param tags object = {
  project: projectName
  environment: environmentName
  managedBy: 'bicep'
}

// Resource group name
var resourceGroupName = 'rg-${projectName}-${environmentName}'

// Create resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

// Deploy Azure OpenAI
module openai 'modules/openai.bicep' = {
  scope: rg
  name: 'openai-deployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
  }
}

// Deploy Key Vault
module keyvault 'modules/keyvault.bicep' = {
  scope: rg
  name: 'keyvault-deployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
    openaiEndpoint: openai.outputs.endpoint
    openaiApiKey: openai.outputs.apiKey
  }
}

// Deploy Monitoring
module monitoring 'modules/monitoring.bicep' = {
  scope: rg
  name: 'monitoring-deployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
  }
}

// Outputs
output resourceGroupName string = rg.name
output openaiEndpoint string = openai.outputs.endpoint
output openaiDeploymentName string = openai.outputs.deploymentName
output keyVaultName string = keyvault.outputs.keyVaultName
output appInsightsConnectionString string = monitoring.outputs.appInsightsConnectionString
