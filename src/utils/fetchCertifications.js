// src/utils/fetchCertifications.js

/**
 * Create a placeholder image for certifications using SVG data URI
 */
const createPlaceholderImage = (text, backgroundColor = "#4f46e5") => {
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="8" fill="${backgroundColor}"/>
      <text x="32" y="38" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Get fallback image for broken certification images
 */
const getFallbackImage = () => {
  return createPlaceholderImage("🏆", "#6b7280");
};

/**
 * Fetch certifications from Credly
 * Note: Credly's API is not publicly available for individual developers.
 * This implementation provides several alternatives:
 * 1. Mock data for development/demo purposes
 * 2. Manual configuration for real certifications
 * 3. Future integration options
 */
export const fetchCertifications = async () => {
  // Note: Credly API access is restricted to enterprise partners
  // For individual developers, use one of these approaches:
  // 1. Manual configuration (recommended)
  // 2. Mock data (for demo)
  // 3. Public profile scraping (limited)

  const manualCertifications = process.env.GATSBY_CREDLY_MANUAL_CERTS;
  const credlyPublicProfile = process.env.GATSBY_CREDLY_PUBLIC_PROFILE;

  // Mock data fallback with proper placeholder images
  const mockData = [
    {
      id: "cert-k8s-cka",
      name: "CKA: Certified Kubernetes Administrator",
      description: "Demonstrates advanced proficiency in JavaScript programming, including ES6+ features, async programming, and modern development practices.",
      image_url: "https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png",
      issued_at: "2023-01-15T00:00:00Z",
      issuer: "CNCF (Cloud Native Computing Foundation)",
      badge_template: {
        name: "JavaScript Developer Certification",
        image_url: createPlaceholderImage("JS", "#f7df1e")
      },
      public_url: "https://www.credly.com/badges/8f69e49b-f1fa-4f33-b707-0df09dc01a4c/public_url",
      expires_at: null
    },
    {
      id: "cert-prom-assoc",
      name: "PCA: Prometheus Certified Associate",
      description: "Validates expertise in monitoring and observability.",
      image_url: "https://images.credly.com/size/340x340/images/c34436dc-1cfd-4125-a862-35f9c86ca17f/image.png",
      issued_at: "2023-03-10T00:00:00Z",
      issuer: "CNCF (Cloud Native Computing Foundation)",
      badge_template: {
        name: "Prometheus Certified Associate",
        image_url: createPlaceholderImage("PROM", "#0078d4")
      },
      public_url: "https://www.credly.com/badges/d95fcebc-e0c9-4d4a-8ab8-5c795926a84f/public_url",
      expires_at: "2026-03-10T00:00:00Z"
    },
    {
      id: "cert-azure-dev",
      name: "Microsoft Certified: Azure Developer Associate",
      description: "Validates skills in developing cloud solutions that span multiple services, including compute, storage, security, and monitoring.",
      image_url: "https://images.credly.com/images/95583311-36dd-4a12-9066-8bd1e0aa5c20/converted20250723-31-p5ehw7.png",
      issued_at: "2023-08-15T00:00:00Z",
      issuer: "Microsoft",
      badge_template: {
        name: "Azure Developer Associate",
        image_url: createPlaceholderImage("AZ", "#0078d4")
      },
      public_url: "https://learn.microsoft.com/en-us/users/arunpaul-9812/credentials/86c872fc6eacbfa8?ref=https%3A%2F%2Fwww.credly.com%2F",
      expires_at: "2026-08-15T00:00:00Z"
    },
    {
      id: "cert-azure-architect",
      name: "Microsoft Azure Architect Technologies",
      description: "Demonstrates ability to design, build and deploy cloud-native applications for Kubernetes.",
      image_url: "https://images.credly.com/images/285339cc-675a-4b1a-bdd9-283868af2fc8/EXAM-Expert-AZ-303-600x600.png",
      issued_at: "2023-10-05T00:00:00Z",
      issuer: "Cloud Native Computing Foundation",
      badge_template: {
        name: "AZ-303: Microsoft Azure Architect Technologies",
        image_url: createPlaceholderImage("K8s", "#326ce5")
      },
      public_url: "https://www.credly.com/badges/b4f51722-6876-4240-a0d5-c8e20b444089/public_url",
      expires_at: "2026-10-05T00:00:00Z"
    },
    {
      id: "cert-coursera-mlops",
      name: "Supervised Machine Learning: Regression and Classification",
      description: "Demonstrates ability to design, build and deploy mlops pipelines for machine learning models.",
      image_url: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/b4/5cb90bb92f420b99bf323a0356f451/Icon.png?auto=format%2Ccompress&dpr=1&w=80&h=80",
      issued_at: "2025-10-05T00:00:00Z",
      issuer: "Coursera",
      badge_template: {
        name: "Supervised Machine Learning: Regression and Classification",
        image_url: createPlaceholderImage("K8s", "#326ce5")
      },
      public_url: "https://www.coursera.org/account/accomplishments/verify/36HHTRDOZ1TN",
      expires_at: "2026-10-05T00:00:00Z"
    },
    {
      id: "cert-kusto-badge1",
      name: "Kusto Detective Agency - Case #1 Badge",
      description: "Demonstrates ability to query and analyze data using Kusto Query Language (KQL) in Microsoft Azure.",
      image_url: "https://images.credly.com/size/340x340/images/14d53c52-2701-4045-9f89-e5e510eee2fd/image.png",
      issued_at: "2023-10-05T00:00:00Z",
      issuer: "Microsoft",
      badge_template: {
        name: "Kusto Detective Agency - Case #1 Badge",
        image_url: createPlaceholderImage("K8s", "#326ce5")
      },
      public_url: "https://www.credly.com/badges/b1617377-a8fa-4594-9e54-4a65da1d1853/public_url",
      expires_at: "2026-10-05T00:00:00Z"
    }
  ];

  try {
    // Check for manual certification configuration
    if (manualCertifications) {
      console.log('📋 Using manually configured certifications');

      try {
        const parsed = JSON.parse(manualCertifications);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`✅ Loaded ${parsed.length} manual certifications`);
          return parsed;
        }
      } catch (parseError) {
        console.warn('⚠️ Failed to parse manual certifications:', parseError.message);
      }
    }

    // Check for public profile URL
    if (credlyPublicProfile) {
      console.log('🌐 Attempting to use Credly public profile...');

      // Note: This would require server-side implementation or CORS proxy
      // For now, we'll provide instructions for manual setup
      console.log('ℹ️ Public profile integration requires server-side implementation');
      console.log(`📝 Your public profile: ${credlyPublicProfile}`);
    }

    // Default to mock data with helpful message
    console.log('📋 Using mock certification data');
    console.log('💡 To display real certifications:');
    console.log('   1. Add GATSBY_CREDLY_MANUAL_CERTS environment variable with JSON array');
    console.log('   2. Or set GATSBY_CREDLY_PUBLIC_PROFILE with your public Credly profile URL');

    // Simulate network delay for mock data
    await new Promise(resolve => setTimeout(resolve, 800));

    return mockData;

  } catch (error) {
    console.warn('⚠️ Error loading certifications:', error.message);
    console.log('📋 Falling back to mock certification data');

    // Simulate network delay for mock data
    await new Promise(resolve => setTimeout(resolve, 800));

    return mockData;
  }
};

/**
 * Fetch public Credly badges by organization or user public profile
 * This doesn't require API keys but has limited data
 */
export const fetchPublicCredlyBadges = async (publicProfileUrl) => {
  try {
    if (!publicProfileUrl) {
      throw new Error('No public profile URL provided');
    }

    console.log('🌐 Attempting to fetch public Credly profile...');

    // Note: This is a simplified approach. In practice, you might need to:
    // 1. Use a CORS proxy for client-side requests
    // 2. Implement server-side scraping
    // 3. Use Credly's embed widgets

    // For now, return a message about public profile availability
    return {
      success: false,
      message: 'Public profile fetching requires server-side implementation or Credly embed widgets',
      public_url: publicProfileUrl,
      suggestion: 'Consider using Credly embed widgets or server-side scraping for public profiles'
    };

  } catch (error) {
    console.error('Error fetching public Credly profile:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if a certification is expired
 */
export const isCertificationExpired = (certification) => {
  if (!certification.expires_at) {
    return false; // No expiration date means it doesn't expire
  }

  const expirationDate = new Date(certification.expires_at);
  const now = new Date();

  return expirationDate < now;
};

/**
 * Group certifications by issuer
 */
export const groupCertificationsByIssuer = (certifications) => {
  return certifications.reduce((groups, cert) => {
    const issuer = cert.issuer || 'Unknown';
    if (!groups[issuer]) {
      groups[issuer] = [];
    }
    groups[issuer].push(cert);
    return groups;
  }, {});
};

/**
 * Sort certifications by issue date (newest first)
 */
export const sortCertificationsByDate = (certifications) => {
  return [...certifications].sort((a, b) => {
    const dateA = new Date(a.issued_at);
    const dateB = new Date(b.issued_at);
    return dateB - dateA; // Newest first
  });
};