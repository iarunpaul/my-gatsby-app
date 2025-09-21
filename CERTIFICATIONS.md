# Certifications Configuration

This document explains how to display your real Credly certifications on your about page.

## 🔍 **Important Discovery**

After researching Credly's API documentation, **Credly's API is not publicly available** for individual developers. It's restricted to enterprise partners and organizations. This is why there's no public way to get API keys.

## 📋 **Available Options**

### **Option 1: Manual Configuration (Recommended)**

Add your real certifications manually using environment variables. This gives you full control over how they appear.

#### **Step 1: Create .env.development**
```bash
# In your .env.development file
GATSBY_CREDLY_MANUAL_CERTS='[
  {
    "id": "my-aws-cert",
    "name": "AWS Certified Solutions Architect - Associate",
    "description": "Validates expertise in designing distributed systems on AWS",
    "image_url": "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png",
    "issued_at": "2023-06-15T00:00:00Z",
    "expires_at": "2026-06-15T00:00:00Z",
    "issuer": "Amazon Web Services",
    "public_url": "https://www.credly.com/badges/your-badge-id"
  },
  {
    "id": "my-azure-cert",
    "name": "Microsoft Certified: Azure Developer Associate",
    "description": "Validates skills in developing cloud solutions on Azure",
    "image_url": "https://images.credly.com/size/340x340/images/63316b6c-f2a7-4c8b-b59f-12c876bb1c48/image.png",
    "issued_at": "2023-09-20T00:00:00Z",
    "expires_at": "2025-09-20T00:00:00Z",
    "issuer": "Microsoft",
    "public_url": "https://www.credly.com/badges/your-azure-badge-id"
  }
]'
```

#### **Step 2: Get Your Real Badge Information**
1. Go to your Credly profile: `https://www.credly.com/users/your-username`
2. For each badge you want to display:
   - Right-click the badge image → "Copy image address" for `image_url`
   - Click the badge → Copy the URL for `public_url`
   - Get the issue date from the badge details
   - Get the expiration date (if any)

#### **Step 3: Restart Your Development Server**
```bash
npm run develop
```

### **Option 2: Use Mock Data (Default)**

If you don't configure anything, the component will show professional mock certifications including:
- AWS Certified Solutions Architect
- Microsoft Azure Developer Associate
- Google Cloud Professional Data Engineer
- Certified JavaScript Developer
- Certified Kubernetes Application Developer

### **Option 3: Public Profile URL (Future Enhancement)**

```bash
# For future server-side implementation
GATSBY_CREDLY_PUBLIC_PROFILE=https://www.credly.com/users/your-username
```

This approach would require server-side scraping or a CORS proxy to work around browser restrictions.

## 🎨 **Certification Schema**

Each certification object should have these properties:

```typescript
interface Certification {
  id: string;                    // Unique identifier
  name: string;                  // Certification name
  description: string;           // Brief description
  image_url: string;            // Badge image URL
  issued_at: string;            // ISO date string
  expires_at?: string;          // ISO date string (optional)
  issuer: string;               // Issuing organization
  public_url?: string;          // Link to badge verification
  badge_template?: object;      // Additional metadata
  skills?: string[];            // Related skills
}
```

## 🔗 **Finding Your Badge URLs**

### **Method 1: From Your Credly Profile**
1. Visit `https://www.credly.com/users/[your-username]`
2. Right-click any badge image
3. Select "Copy image address"
4. Use this URL for `image_url`

### **Method 2: From Individual Badge Pages**
1. Click on a badge from your profile
2. Copy the page URL for `public_url`
3. Right-click the large badge image for `image_url`

## 🎯 **Example Real Configuration**

Here's a complete example with real AWS and Azure certifications:

```bash
GATSBY_CREDLY_MANUAL_CERTS='[
  {
    "id": "aws-saa-c03",
    "name": "AWS Certified Solutions Architect - Associate",
    "description": "Demonstrates ability to design distributed systems on AWS",
    "image_url": "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png",
    "issued_at": "2023-08-15T00:00:00Z",
    "expires_at": "2026-08-15T00:00:00Z",
    "issuer": "Amazon Web Services",
    "public_url": "https://www.credly.com/badges/12345678-1234-1234-1234-123456789abc"
  }
]'
```

## 🚀 **Production Deployment**

For production (Netlify, Vercel, etc.), add the same environment variable in your hosting platform's environment variables section.

## 🛠️ **Troubleshooting**

### **JSON Parsing Errors**
- Ensure the JSON is properly escaped in the environment variable
- Use single quotes around the entire value
- Double-check all commas and brackets

### **Images Not Loading**
- Verify the image URLs are accessible
- Check for HTTPS vs HTTP issues
- The component includes fallback SVG images for broken links

### **Environment Variables Not Working**
- Restart your development server after adding variables
- Ensure variables start with `GATSBY_` prefix
- Check for typos in variable names

## 💡 **Tips**

1. **Keep it Professional**: Only include relevant, current certifications
2. **Update Expiration Dates**: The component shows expiration warnings
3. **Optimize Images**: Credly images are usually well-optimized already
4. **Test Locally**: Always test your configuration in development first
5. **Backup Configuration**: Save your certification JSON in a separate file as backup

This approach gives you complete control over your certification display while working within the limitations of Credly's closed API.