/**
 * Azure OpenAI module.
 * Deploys Azure OpenAI account with GPT-4o deployment.
 */

@description('The location for the resource')
param location string

@description('Environment name')
param environmentName string

@description('Project name')
param projectName string

@description('Tags')
param tags object

// Naming
var openaiAccountName = 'oai-${projectName}-${environmentName}'
var deploymentName = environmentName == 'prod' ? 'gpt-4o' : 'gpt-4o-mini'

// Azure OpenAI Account
resource openaiAccount 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: openaiAccountName
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: openaiAccountName
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

// GPT-4o Deployment
resource gpt4oDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openaiAccount
  name: deploymentName
  sku: {
    name: 'Standard'
    capacity: environmentName == 'prod' ? 100 : environmentName == 'staging' ? 30 : 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: environmentName == 'prod' ? 'gpt-4o' : 'gpt-4o-mini'
      version: '2024-05-13'
    }
    raiPolicyName: 'Microsoft.Default'
  }
}

// Outputs
output endpoint string = openaiAccount.properties.endpoint
output deploymentName string = gpt4oDeployment.name
output apiKey string = openaiAccount.listKeys().key1
output accountName string = openaiAccount.name
