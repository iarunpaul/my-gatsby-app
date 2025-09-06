# Azure Deployment Setup Guide for LinkedIn MCP Server

## 🎯 Recommendation: **Create Separate Workflow**

Based on your existing Azure Static Web Apps workflow, I recommend **creating a separate workflow** for the MCP server because:

- ✅ **Different technologies**: Static web app (Gatsby) vs API server (Python)
- ✅ **Different Azure services**: Static Web Apps vs Container Apps
- ✅ **Independent deployments**: Frontend and backend can be deployed separately
- ✅ **Better security**: Keep LinkedIn credentials separate from frontend

## 📋 Setup Steps

### **Step 1: Azure Resource Setup**

#### **1.1 Create Resource Group**
```bash
az group create --name rg-linkedin-mcp --location "East US"
```

#### **1.2 Create Container Registry**
```bash
az acr create \
  --resource-group rg-linkedin-mcp \
  --name acrlinkedinmcp \
  --sku Basic \
  --admin-enabled true
```

#### **1.3 Create Service Principal**
```bash
# Create service principal for GitHub Actions
az ad sp create-for-rbac \
  --name "github-actions-linkedin-mcp" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-linkedin-mcp \
  --sdk-auth
```

### **Step 2: GitHub Secrets Configuration**

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### **Azure Authentication:**
```bash
AZURE_CLIENT_ID=<service-principal-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_SUBSCRIPTION_ID=<your-subscription-id>
AZURE_CONTAINER_REGISTRY_LOGIN=acrlinkedinmcp.azurecr.io
AZURE_CONTAINER_REGISTRY_USERNAME=acrlinkedinmcp
AZURE_CONTAINER_REGISTRY_PASSWORD=<registry-password>
```

#### **LinkedIn MCP Configuration:**
```bash
LINKEDIN_EMAIL=your_linkedin_email@example.com
LINKEDIN_PASSWORD=your_linkedin_password
ANTHROPIC_API_KEY=sk-ant-api03-your_anthropic_key
```

### **Step 3: File Structure Setup**

Create this structure in your repository:

```
my-gatsby-site/
├── .github/workflows/
│   ├── azure-static-web-apps-gray-pebble-0a500ec00.yml  # Keep existing
│   └── azure-mcp-server.yml                             # New workflow
├── mcp-servers/
│   └── linkedin-real/
│       ├── web_server.py                                # MCP server code
│       ├── Dockerfile                                   # Container config
│       ├── requirements.txt                             # Python deps
│       └── .env.example                                 # Env template
└── src/                                                 # Gatsby frontend
```

### **Step 4: Create Required Files**

#### **4.1 requirements.txt**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
anthropic==0.7.8
python-dotenv==1.0.0
requests==2.31.0
pydantic==2.5.0
git+https://github.com/adhikasp/mcp-linkedin
```

#### **4.2 .env.example**
```bash
# LinkedIn MCP Server Configuration
LINKEDIN_EMAIL=your_linkedin_email@example.com
LINKEDIN_PASSWORD=your_linkedin_password
ANTHROPIC_API_KEY=sk-ant-api03-your_anthropic_key

# Server Configuration
MCP_SERVER_PORT=8001
MCP_SERVER_HOST=0.0.0.0
DEBUG=false
LOG_LEVEL=info

# CORS Configuration
ALLOWED_ORIGINS=https://gray-pebble-0a500ec00.azurestaticapps.net,https://web.iarunpaul.com
```

### **Step 5: Update Gatsby Configuration**

#### **5.1 Update .env.production**
```bash
# Add this to your Gatsby .env.production
GATSBY_MCP_SERVER_URL=https://linkedin-mcp-server.azurecontainerapps.io
```

#### **5.2 Update gatsby-config.js**
```javascript
// Add environment variable support
module.exports = {
  // ... existing config
  plugins: [
    // ... existing plugins
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["GATSBY_MCP_SERVER_URL"]
      },
    },
  ],
}
```

#### **5.3 Update React Components**
```javascript
// In your LinkedIn MCP component
const MCP_SERVER_URL = process.env.GATSBY_MCP_SERVER_URL || 'http://localhost:8001';

// Use this URL for API calls
const response = await fetch(`${MCP_SERVER_URL}/api/linkedin/summary`);
```

### **Step 6: Deployment Process**

#### **6.1 Initial Deployment**
1. **Commit all files** to your repository
2. **Push to main branch** - this will trigger the workflow
3. **Monitor GitHub Actions** for deployment progress
4. **Check Azure Portal** for created resources

#### **6.2 Verify Deployment**
```bash
# Test the deployed server
curl https://linkedin-mcp-server.azurecontainerapps.io/health

# Expected response:
{
  "status": "healthy",
  "mcp_server": "real_linkedin",
  "data_source": "adhikasp/mcp-linkedin"
}
```

### **Step 7: Frontend Integration**

#### **7.1 Update Gatsby Build**
Your existing workflow will automatically pick up the new environment variable and deploy the updated frontend.

#### **7.2 Test End-to-End**
1. **Visit your Gatsby site**: https://gray-pebble-0a500ec00.azurestaticapps.net
2. **Check LinkedIn integration** works with Azure-hosted API
3. **Verify CORS** is properly configured

## 🔧 Troubleshooting

### **Common Issues:**

#### **Container Registry Authentication**
```bash
# Get registry credentials
az acr credential show --name acrlinkedinmcp
```

#### **Container App Logs**
```bash
# View container logs
az containerapp logs show \
  --name linkedin-mcp-server \
  --resource-group rg-linkedin-mcp \
  --follow
```

#### **CORS Issues**
Update the `ALLOWED_ORIGINS` environment variable in the Container App:
```bash
az containerapp update \
  --name linkedin-mcp-server \
  --resource-group rg-linkedin-mcp \
  --set-env-vars ALLOWED_ORIGINS="https://gray-pebble-0a500ec00.azurestaticapps.net,https://web.iarunpaul.com"
```

## 💰 Cost Optimization

### **Azure Container Apps Pricing:**
- **Consumption plan**: Pay per use, scale to zero
- **Estimated cost**: $10-30/month for typical usage
- **Free tier**: 2M requests/month included

### **Cost Monitoring:**
```bash
# Set up budget alerts
az consumption budget create \
  --budget-name "linkedin-mcp-budget" \
  --amount 50 \
  --resource-group rg-linkedin-mcp
```

## 🚀 Production Checklist

- [ ] **Azure resources created** (Resource Group, Container Registry)
- [ ] **GitHub secrets configured** (Azure auth + LinkedIn credentials)
- [ ] **Workflow files added** to repository
- [ ] **Docker files created** (Dockerfile, requirements.txt)
- [ ] **Gatsby environment updated** (production API URL)
- [ ] **CORS configured** for your domain
- [ ] **Health checks passing** on deployed container
- [ ] **End-to-end testing** completed

## 🎯 Benefits of This Approach

### **Scalability:**
- ✅ **Auto-scaling**: Scale to zero when not in use
- ✅ **Global distribution**: Azure's global network
- ✅ **High availability**: Built-in redundancy

### **Security:**
- ✅ **Managed identity**: Secure Azure service access
- ✅ **Environment isolation**: Separate dev/prod environments
- ✅ **Secret management**: Secure credential storage

### **DevOps:**
- ✅ **Automated deployments**: GitHub Actions CI/CD
- ✅ **Independent releases**: Frontend and backend deploy separately
- ✅ **Monitoring**: Azure Application Insights integration

This setup gives you a **production-ready, scalable LinkedIn MCP server** on Azure while keeping your existing Gatsby deployment workflow intact! 🎉

