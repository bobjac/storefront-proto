/**
 * Parameters file for development environment.
 */

using './main.bicep'

param location = 'eastus2'
param environmentName = 'dev'
param projectName = 'storefront-ai'
param tags = {
  project: 'storefront-ai'
  environment: 'dev'
  managedBy: 'bicep'
}
