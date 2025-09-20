# 🚀 Azure Deployment Setup Guide

This guide walks you through setting up the complete deployment pipeline for the Enhanced LinkedIn Career Server to Azure App Service.

## 📋 Prerequisites

1. **Azure Account** with an active subscription
2. **GitHub Repository** with admin access
3. **Anthropic API Key** for Claude AI integration

## 🔐 Required GitHub Secrets

You need to set up the following secrets in your GitHub repository:

### Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 1. Azure Authentication (OIDC)
```
AZURE_CLIENT_ID: [Your Azure App Registration Client ID]
AZURE_TENANT_ID: [Your Azure Tenant ID]
AZURE_SUBSCRIPTION_ID: [Your Azure Subscription ID]
```

### 2. API Keys and Configuration
```
ANTHROPIC_API_KEY: [Your Anthropic API key for Claude]
LINKEDIN_EMAIL: [LinkedIn account email - optional for enhanced scraping]
LINKEDIN_PASSWORD: [LinkedIn account password - optional for enhanced scraping]
FRONTEND_URL: [Your deployed frontend URL, e.g., https://yoursite.netlify.app]
```

## 🏗️ Azure Setup Steps

### 1. Create Azure App Registration (for OIDC authentication)

```bash
# Login to Azure CLI
az login

# Create app registration for GitHub Actions
az ad app create --display-name "GitHub-Actions-LinkedIn-Server"

# Note the appId from the output - this is your AZURE_CLIENT_ID

# Create service principal
az ad sp create --id [APP_ID_FROM_ABOVE]

# Get your tenant and subscription IDs
az account show --query "{subscriptionId:id, tenantId:tenantId}"
```

### 2. Configure Federated Credentials

```bash
# Replace [APP_ID] with your actual app ID
az ad app federated-credential create `
  --id [APP_ID] `
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:iarunpaul/my-gatsby-app:ref:refs/heads/main",
    "description": "GitHub Actions main branch",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 3. Assign Azure Permissions

```bash
# Get your service principal object ID
$SP_ID=$(az ad sp list --display-name "GitHub-Actions-LinkedIn-Server" --query "[0].id" -o tsv)

# Assign Contributor role to your subscription
az role assignment create `
  --assignee $SP_ID `
  --role Contributor `
  --scope /subscriptions/[YOUR_SUBSCRIPTION_ID]
```

## 🔧 Configuration Files Created

The deployment setup includes these new files:

### 1. `.github/workflows/deploy-linkedin-server.yml`
- Azure App Service deployment workflow
- Automatic resource creation (Free Tier F1)
- Environment variable configuration
- Health checks and testing

### 2. `server/package.json`
- Node.js dependencies and scripts
- Azure-compatible configuration
- Production-ready settings

### 3. `server/web.config`
- IIS/Azure App Service configuration
- URL rewriting rules
- Production environment settings

## 🌐 Deployment Process

### 1. Automatic Deployment
- Push to `main` branch triggers deployment
- Workflow creates Azure resources if they don't exist
- Deploys server to Azure App Service Free Tier

### 2. Manual Deployment
```bash
# Trigger manual deployment
gh workflow run deploy-linkedin-server.yml
```

### 3. Monitor Deployment
- Check GitHub Actions tab for deployment status
- Monitor Azure App Service logs if needed

## 🎯 Expected Azure Resources

After successful deployment, you'll have:

### Resource Group: `Pollys`
- **App Service Plan**: `asp-linkedin-career-free` (Free Tier F1)
- **Web App**: `linkedin-career-server` (Node.js 18 LTS)

### Cost: **$0/month** (Free Tier)
- 60 CPU minutes/day
- 1GB storage
- Auto-sleep after 20 minutes of inactivity

## 🔗 Post-Deployment URLs

After deployment, your server will be available at:
```
Production Server: https://linkedin-career-server.azurewebsites.net
Health Check: https://linkedin-career-server.azurewebsites.net/health
LinkedIn Jobs API: https://linkedin-career-server.azurewebsites.net/api/linkedin/jobs
Cover Letter API: https://linkedin-career-server.azurewebsites.net/api/career/cover-letter
Chat API: https://linkedin-career-server.azurewebsites.net/api/career/chat
```

## 🛠️ Frontend Integration

Update your frontend to use the deployed server:

```javascript
// In src/api/career-copilot.js or similar
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://linkedin-career-server.azurewebsites.net'
  : 'http://localhost:3001';
```

## 🧪 Testing the Deployment

### Health Check
```bash
curl https://linkedin-career-server.azurewebsites.net/health
```

### LinkedIn Jobs API
```bash
curl "https://linkedin-career-server.azurewebsites.net/api/linkedin/jobs?keywords=developer&limit=5"
```

### Cover Letter API (Template Mode)
```bash
curl -X POST https://linkedin-career-server.azurewebsites.net/api/career/cover-letter \
  -H "Content-Type: application/json" \
  -d '{"message": "cover letter for Netflix Data Scientist"}'
```

## 🚨 Troubleshooting

### Common Issues:

1. **Authentication Errors**
   - Verify AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID
   - Check federated credentials configuration

2. **App Service Not Starting**
   - Check package.json scripts
   - Verify Node.js version compatibility
   - Review Azure App Service logs

3. **CORS Issues**
   - Update FRONTEND_URL secret with correct domain
   - Check CORS configuration in server code

4. **API Errors**
   - Verify ANTHROPIC_API_KEY is valid
   - Check environment variable configuration in Azure

### Logs and Monitoring:
```bash
# View Azure App Service logs
az webapp log tail --name linkedin-career-server --resource-group Pollys

# Download logs
az webapp log download --name linkedin-career-server --resource-group Pollys
```

## 📞 Support

If you encounter issues:
1. Check GitHub Actions workflow logs
2. Review Azure App Service logs
3. Verify all secrets are correctly configured
4. Test endpoints manually with curl/Postman

## 🎉 Success Checklist

- [ ] All GitHub secrets configured
- [ ] Azure resources created successfully
- [ ] Deployment workflow completed without errors
- [ ] Health check endpoint responding
- [ ] LinkedIn jobs API returning data
- [ ] Cover letter API generating templates
- [ ] Frontend updated to use deployed server
- [ ] End-to-end testing completed

Your Enhanced LinkedIn Career Server is now deployed and ready for production use! 🚀