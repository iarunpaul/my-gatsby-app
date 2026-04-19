/**
 * Reconstructs answer options for 46 image-based questions that lost their
 * options during scraping. Options are sourced from Azure documentation,
 * exam community knowledge, and the question context.
 *
 * Run: node scripts/fix-missing-options.js
 */

const fs = require('fs')
const path = require('path')
const JSON_PATH = path.join(__dirname, '../src/data/AZ-204_Final_Processed_Questions.json')

// Helper: letter(s) → 0-based indices
function lettersToIndices(ans) {
  return [...ans].filter(c => /[A-E]/.test(c)).map(c => c.charCodeAt(0) - 65)
}

// Strip trailing votes JSON from question_text
function stripVotes(text) {
  return text.replace(/\s*\[\{.*\}\]\s*$/s, '').trim()
}

// Each entry: { seq, options: [{text}], correctAnswers, explanation?, explanation_reference? }
const FIXES = [
  {
    seq: 11,
    options: [
      { text: 'Activity log' },
      { text: 'Application Insights' },
      { text: 'Metric' },
      { text: 'Log' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'Metric signals in Azure Monitor support dimensions, allow minimal alert creation time, and generate a single notification both when the alert fires and when it resolves. Activity log signals are event-based and do not support dimensions. Log search signals have higher creation overhead.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types#metric-alerts',
  },
  {
    seq: 12,
    // "search the index using regular expressions" → Lucene full query syntax
    options: [
      { text: 'Set the SearchOptions.QueryType property to QueryType.Simple' },
      { text: 'Set the SearchOptions.QueryType property to QueryType.Full' },
      { text: 'Set the SearchOptions.Filter property to an OData expression' },
      { text: 'Use the SuggestAsync method with a SuggestOptions object' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'Azure Cognitive Search supports regular expressions only through the full Lucene query syntax. Setting QueryType to Full enables Lucene syntax, which includes regex patterns using the /pattern/ notation. The simple query syntax does not support regular expressions.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/search/query-lucene-syntax',
  },
  {
    seq: 13,
    stripVotes: true,
    options: [
      { text: 'The Azure portal' },
      { text: 'Logic Apps Designer in Visual Studio' },
      { text: 'The Azure CLI' },
      { text: 'Logic Apps Designer in Visual Studio Code' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'Logic Apps Designer in Visual Studio provides a full visual design surface for creating and updating Logic App definitions. It integrates with Azure Resource Manager templates and supports direct publishing to Azure, making it the ideal tool for updating Logic App definitions from a development environment.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/logic-apps/manage-logic-apps-with-visual-studio',
  },
  {
    seq: 18,
    // "price range AND distance to airport" → Filter property with OData + geo.distance()
    options: [
      { text: 'Set the SearchOptions.QueryType property to QueryType.Full and use Lucene syntax' },
      { text: 'Use the SuggestAsync method with SuggestOptions' },
      { text: 'Set the SearchOptions.HighlightFields property' },
      { text: 'Set the SearchOptions.Filter property using OData expressions with geo.distance()' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'Filtering by price range and geographic proximity requires OData filter expressions. The SearchOptions.Filter property accepts OData $filter syntax including geo.distance() for proximity filtering and range operators (ge, le) for price. For example: "price ge 100 and price le 500 and geo.distance(location, geography\'POINT(-122 47)\') le 10".',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/search/search-filters',
  },
  {
    seq: 19,
    stripVotes: true,
    options: [
      { text: 'The Azure portal' },
      { text: 'Logic Apps Designer in Visual Studio' },
      { text: 'The Microsoft Graph API' },
      { text: 'Logic Apps Designer in Visual Studio Code' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'Logic Apps Designer in Visual Studio Code provides an extension for editing Logic App workflows directly in VS Code. It supports both Consumption and Standard Logic Apps workflows with a visual designer and code view, making it suitable for editing existing Logic App workflows.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/logic-apps/create-single-tenant-workflows-visual-studio-code',
  },
  {
    seq: 41,
    options: [
      { text: 'Deploy the website to a virtual machine scale set' },
      { text: 'Deploy the website to an Azure App Service in a Premium tier' },
      { text: 'Deploy the website to Azure Container Instances' },
      { text: 'Deploy the website to an Azure App Service and enable autoscaling' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'Azure App Service with autoscaling meets all requirements: it automatically scales out under high traffic to keep the site responsive, scales back in when traffic decreases to minimize cost, and is highly available by default with built-in load balancing. Virtual machine scale sets and Premium tier are more costly and require more management.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/app-service/manage-scale-up',
  },
  {
    seq: 72,
    options: [
      { text: 'Orchestrator function' },
      { text: 'Entity function' },
      { text: 'Client function' },
      { text: 'Activity function' },
    ],
    correctAnswers: lettersToIndices('AD'),
    explanation: 'An Orchestrator function manages the ordering and coordination of the workflow (calling the external API step, managing retries). An Activity function performs the actual work — in this case calling the external API to retrieve product discount information. These two function types work together: the orchestrator defines the workflow, the activity executes each step.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-types-features-overview',
  },
  {
    seq: 115,
    options: [
      { text: 'QueueClient' },
      { text: 'SubscriptionClient' },
      { text: 'TopicClient' },
      { text: 'EventHubClient' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'QueueClient is used to receive messages from an Azure Service Bus queue. Unlike topics and subscriptions (which support multiple subscribers and message persistence across subscribers), a queue delivers a message to a single receiver and removes it after processing — satisfying the requirement that messages must not persist after being processed.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues',
  },
  {
    seq: 117,
    // "configure and execute requests in NoSQL globally-distributed DB (CosmosDB)"
    options: [
      { text: 'var cosmosClient = new CosmosClient(endpoint, key);' },
      { text: 'var database = cosmosClient.GetDatabase("database1");' },
      { text: 'var container = database.GetContainer("container1");' },
      { text: 'var iterator = container.GetItemQueryIterator<T>(queryDef);' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'In the Azure Cosmos DB .NET SDK v3, the Container object is used to configure and execute all data operations (reads, writes, queries, deletes) against a specific collection. You obtain it via database.GetContainer("containerName"). It is the primary interface for CRUD operations and query execution.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/sdk-dotnet-v3',
  },
  {
    seq: 145,
    // Same question, different option set (code segments showing the complete call chain)
    options: [
      { text: 'new CosmosClient(accountEndpoint, accountKey)' },
      { text: 'cosmosClient.GetDatabase("db").GetContainer("col").GetItemQueryIterator<T>(query)' },
      { text: 'new CosmosClientBuilder(endpoint, key).Build()' },
      { text: 'cosmosClient.ReadAccountAsync()' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'The chained call cosmosClient.GetDatabase().GetContainer().GetItemQueryIterator<T>() both configures the target (database + container) and executes the query request. This single expression navigates the hierarchy and returns a FeedIterator to enumerate query results — covering both configuration and execution in one object chain.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/sdk-dotnet-v3',
  },
  {
    seq: 166,
    // "set the visibility timeout value of individual messages"
    options: [
      { text: 'Create Message' },
      { text: 'Peek Messages' },
      { text: 'Delete Message' },
      { text: 'Get Messages' },
      { text: 'Update Message' },
    ],
    correctAnswers: lettersToIndices('DE'),
    explanation: 'Two operations can set the visibility timeout of individual messages. Get Messages retrieves one or more messages and sets their visibility timeout for the duration the application is processing them. Update Message explicitly changes the visibility timeout of an already-retrieved message, allowing the application to extend the processing window before the message reappears in the queue.',
    explanation_reference: 'https://learn.microsoft.com/en-us/rest/api/storageservices/operations-on-messages',
  },
  {
    seq: 173,
    options: [
      { text: 'GetPropertiesAsync()' },
      { text: 'GetMessagesAsync()' },
      { text: 'PeekMessagesAsync()' },
      { text: 'ReceiveMessagesAsync()' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'QueueClient.GetPropertiesAsync() returns a QueueProperties object that includes the ApproximateMessagesCount property — the fastest way to get an approximate message count with minimal code. It makes a single API call without retrieving any messages. PeekMessages and GetMessages both retrieve actual message content and require handling the results.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/storage/queues/storage-dotnet-how-to-use-queues',
  },
  {
    seq: 184,
    // "APIM, every request to backend must include valid HTTP authorization header"
    options: [
      { text: 'authentication-managed-identity' },
      { text: 'ip-filter' },
      { text: 'authentication-basic' },
      { text: 'rate-limit-by-key' },
    ],
    correctAnswers: lettersToIndices('AC'),
    explanation: 'Two APIM authentication policies can send an HTTP authorization header to the backend. authentication-managed-identity obtains a bearer token using the APIM managed identity and adds it as an Authorization header. authentication-basic adds a Basic authentication header (Base64-encoded username:password). Both ensure every backend request includes a valid HTTP authorization header.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/api-management/api-management-authentication-policies',
  },
  {
    seq: 192,
    options: [
      { text: 'Basic authentication' },
      { text: 'Client certificate authentication' },
      { text: 'Managed identity' },
      { text: 'OAuth 2.0 authorization code flow' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'Managed identity is the correct mechanism when callers must not send credentials to the API. The API itself authenticates to other Azure resources using its system-assigned or user-assigned managed identity, obtaining tokens from Azure AD automatically. No credentials are stored or transmitted by the caller — Azure handles the identity lifecycle.',
    explanation_reference: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview',
  },
  {
    seq: 218,
    options: [
      { text: 'Enable the Identity Protection service' },
      { text: 'Enable the multi-factor authentication service settings' },
      { text: 'Create a conditional access policy in Azure Active Directory' },
      { text: 'Register the website in Azure Active Directory' },
    ],
    correctAnswers: lettersToIndices('BC'),
    explanation: 'To implement MFA for the website: (B) Enable the MFA service settings to activate the MFA capability for the tenant, and (C) Create a Conditional Access policy that targets the website application and requires MFA as the grant control. Conditional Access policies allow granular control — enforcing MFA specifically for users accessing sensitive data in this application.',
    explanation_reference: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-all-users-mfa',
  },
  {
    seq: 222,
    options: [
      { text: 'Service SAS' },
      { text: 'Account SAS' },
      { text: 'User delegation SAS' },
      { text: 'Access key' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'A Service SAS is the correct choice because it grants access scoped to a specific service (the queue) rather than the whole storage account, meeting the "queue level only" requirement. By linking the Service SAS to a stored access policy, you can revoke it at any time without regenerating the storage account keys — satisfying all three requirements.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview',
  },
  {
    seq: 226,
    stripVotes: true,
    options: [
      { text: 'Use Azure Active Directory B2C' },
      { text: 'Use Azure Active Directory' },
      { text: 'Use Azure Active Directory B2B' },
      { text: 'Use a federated identity provider directly' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'Azure AD B2C is purpose-built for consumer-facing applications with multiple identity providers. It supports both custom in-house identity providers (via OpenID Connect/SAML federation) and social providers (Google, Facebook, Apple, etc.) out of the box, and provides SSO across all linked applications through a unified identity experience.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview',
  },
  {
    seq: 228,
    stripVotes: true,
    options: [
      { text: 'Microsoft Graph' },
      { text: 'Azure Active Directory B2C' },
      { text: 'Microsoft Identity Platform' },
      { text: 'Azure AD Privileged Identity Management' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'Microsoft Graph provides access to organizational data including employee profiles, expertise, and skills through the Microsoft 365 directory. Administrators can grant and revoke consent through Azure AD app permissions, giving them full control over what data the report accesses. Microsoft Graph is the standard API for accessing user directory information with admin-controlled consent.',
    explanation_reference: 'https://learn.microsoft.com/en-us/graph/overview',
  },
  {
    seq: 244,
    stripVotes: true,
    options: [
      { text: 'Create a new API version for each API' },
      { text: 'Configure rate-limit policies on all APIs' },
      { text: 'Add an inbound policy to transform responses and remove backend headers' },
      { text: 'Create a new API product with restricted visibility' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'APIM transformation policies in the inbound and outbound policy sections can remove or modify HTTP headers that reveal backend technology (e.g., X-Powered-By, Server, X-AspNet-Version) and transform URLs to hide the actual backend address. The set-header and rewrite-uri policies are specifically designed to obscure backend implementation details from API consumers.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/api-management/api-management-transformation-policies',
  },
  {
    seq: 251,
    options: [
      { text: 'Azure Key Vault access policies' },
      { text: 'Azure Policy with a Key Vault key properties definition' },
      { text: 'Key Vault key rotation configuration' },
      { text: 'Key Vault RBAC roles' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'Azure Policy can enforce key properties when keys are created or updated in Key Vault. A built-in Azure Policy definition ("Azure Key Vault keys should have the specified cryptographic type") can be assigned to enforce RSA or EC key types and minimum key sizes. This prevents creation of non-compliant keys at a governance level across all vaults in scope.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/key-vault/keys/policy-reference',
  },
  {
    seq: 254,
    options: [
      { text: 'Accept: application/json' },
      { text: 'Content-Type: application/json' },
      { text: 'Prefer: return=minimal' },
      { text: 'Prefer: include-unknown-enum-members' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'Microsoft Graph uses evolvable enumerations to allow adding new members to existing enum types without breaking changes. To receive these new/unknown members in GET responses, the client must send the HTTP header "Prefer: include-unknown-enum-members". Without this header, unknown enum values are omitted or returned as their sentinel value.',
    explanation_reference: 'https://learn.microsoft.com/en-us/graph/best-practices-concept#use-evolvable-enumerations',
  },
  {
    seq: 256,
    options: [
      { text: 'SecretClient' },
      { text: 'CertificateClient' },
      { text: 'CryptographyClient' },
      { text: 'KeyClient' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'KeyClient (Azure.Security.KeyVault.Keys) is the object used to retrieve, create, and manage cryptographic keys in Azure Key Vault. Use KeyClient.GetKey() to retrieve an asymmetric key pair (RSA or EC). For subsequent encryption/decryption operations, a CryptographyClient can be created from the retrieved KeyVaultKey. KeyClient handles the key retrieval; CryptographyClient handles operations.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/key-vault/keys/quick-create-net',
  },
  {
    seq: 269,
    options: [
      { text: 'Import-AzApiManagementApi' },
      { text: 'New-AzApiManagementApi' },
      { text: 'Set-AzApiManagementApi' },
      { text: 'Add-AzApiManagementApiToProduct' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'Import-AzApiManagementApi is the PowerShell cmdlet that imports an API definition from an external source into Azure API Management. It supports OpenAPI (Swagger), WADL, and WSDL formats. The -SpecificationFormat and -SpecificationUrl or -SpecificationPath parameters specify the OpenAPI specification to import.',
    explanation_reference: 'https://learn.microsoft.com/en-us/powershell/module/az.apimanagement/import-azapimanagementapi',
  },
  {
    seq: 270,
    options: [
      { text: 'Set the CorrelationId property on each alarm message' },
      { text: 'Use a Service Bus dead-letter queue for audit storage' },
      { text: 'Enable duplicate detection on the Service Bus topic' },
      { text: 'Store the alarm type in the ReplyTo and custom message properties' },
    ],
    correctAnswers: lettersToIndices('AD'),
    explanation: 'For a reply trail audit: (A) Set CorrelationId to link each alarm response message back to the original alarm trigger, creating a traceable chain of events. (D) Store the alarm type in ReplyTo and custom message properties so every audit record captures what alarm was activated. Together these create a complete audit trail linking each transaction to its alarm type.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messages-payloads',
  },
  {
    seq: 271,
    options: [
      { text: 'Use static SqlConnection objects to reuse connections across function invocations' },
      { text: 'Increase the CommandTimeout value in the connection string' },
      { text: 'Implement exponential backoff retry logic' },
      { text: 'Use Azure SQL Managed Instance instead of Azure SQL Database' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'Azure Functions creates a new instance per invocation, which can exhaust the SQL connection pool if each invocation creates and disposes its own SqlConnection. Declaring SqlConnection as a static field outside the function method causes it to be shared and reused across invocations within the same host instance, dramatically reducing pool pressure and preventing the "max pool size was reached" exception.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-functions/manage-connections',
  },
  {
    seq: 284,
    options: [
      { text: 'Type' },
      { text: 'Data' },
      { text: 'Target' },
      { text: 'Name' },
      { text: 'Success' },
    ],
    correctAnswers: lettersToIndices('BD'),
    explanation: 'For tracking dependencies to a non-SQL database: (B) Data contains the exact command or query sent to the database (e.g., the query string or command text), providing detail about what was executed. (D) Name identifies the dependency call in a human-readable way (e.g., "SELECT * FROM table"). These two properties together give Application Insights enough information to display and correlate the dependency call in the telemetry.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics#trackdependency',
  },
  {
    seq: 299,
    options: [
      { text: 'Use a configuration snapshot to ensure point-in-time consistency across all settings' },
      { text: 'Register a sentinel key and poll it to detect when any configuration has changed' },
      { text: 'Use Azure Event Grid push notifications for configuration changes' },
      { text: 'Increase the cache expiration interval to reduce App Configuration API calls' },
    ],
    correctAnswers: lettersToIndices('AB'),
    explanation: '(A) Configuration snapshots capture all 100 settings at a single point in time, ensuring consistency — no partial updates where some settings are new and others old. (B) A sentinel key is a single key whose value changes whenever any configuration changes; polling just this one key instead of all 100 dramatically reduces API calls while still enabling dynamic updates without restart.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-snapshots',
  },
  {
    seq: 316,
    stripVotes: true,
    options: [
      { text: 'allkeys-lru' },
      { text: 'volatile-lru' },
      { text: 'allkeys-random' },
      { text: 'noeviction' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'allkeys-lru evicts the least recently used keys from all keys in the cache when memory is full, maximizing the amount of cache space available for frequently read data. volatile-lru only evicts keys that have a TTL set, which would leave non-expiring keys consuming space. noeviction prevents any writes when memory is full. allkeys-lru best serves read-heavy workloads.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-configure#maxmemory-policy-and-maxmemory-reserved',
  },
  {
    seq: 320,
    options: [
      { text: 'Disable sampling in ApplicationInsights.config' },
      { text: 'Enable adaptive sampling in the TelemetryConfiguration' },
      { text: 'Switch to InMemoryChannel for faster telemetry flushing' },
      { text: 'Enable fixed-rate sampling and apply it to both client and server components' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'Fixed-rate sampling reduces telemetry volume by a configurable percentage while preserving statistical validity. Crucially, when applied consistently to both client (browser) and server, it uses the same sampling decision for a given request — ensuring that correlated client and server telemetry for the same HTTP request is either both included or both excluded, maintaining end-to-end correlation.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/sampling',
  },
  {
    seq: 321,
    options: [
      { text: 'Enable fixed-rate sampling at 50%' },
      { text: 'Increase the TelemetryChannel buffer capacity' },
      { text: 'Use ServerTelemetryChannel instead of InMemoryChannel' },
      { text: 'Implement a custom ITelemetryProcessor to drop events' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'ServerTelemetryChannel is designed for high-throughput scenarios. Unlike InMemoryChannel (the default), it persists telemetry to local disk storage when the network is unavailable or when the ingestion endpoint is overloaded, then retries sending. This prevents data loss under high telemetry rates and resolves increased ingestion error rates caused by back-pressure.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/telemetry-channels',
  },
  {
    seq: 325,
    options: [
      { text: 'Increase the TelemetryChannel buffer size in the configuration' },
      { text: 'Enable fixed-rate sampling in the SDK configuration' },
      { text: 'Disable adaptive sampling' },
      { text: 'Enable adaptive sampling in the SDK configuration' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'Fixed-rate sampling reduces telemetry at a consistent, configurable rate (e.g. 10%), preserving statistical correctness for analysis. It also supports correlation of HTTP requests across client and server by applying the same sampling decision to related telemetry items. This reduces traffic, data, and storage costs while keeping the data statistically representative.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/sampling',
  },
  {
    seq: 341,
    options: [
      { text: 'Azure Service Bus queues' },
      { text: 'Azure Service Bus topics' },
      { text: 'Azure Event Hubs' },
      { text: 'Azure Event Grid' },
    ],
    correctAnswers: lettersToIndices('AB'),
    explanation: 'Both Azure Service Bus queues and topics support: (1) Transactions — atomic send/receive operations within a single transaction. (2) Duplicate detection — configurable duplicate detection window that discards duplicate messages. (3) Unlimited storage period — TTL can be set to TimeSpan.MaxValue, effectively storing messages indefinitely. Event Hubs and Event Grid do not support transactions or native duplicate detection.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview',
  },
  {
    seq: 345,
    options: [
      { text: 'Azure Event Grid' },
      { text: 'Azure Queue Storage' },
      { text: 'Azure Service Bus topics' },
      { text: 'Azure Event Hubs' },
    ],
    correctAnswers: lettersToIndices('AC'),
    explanation: '(A) Azure Event Grid uses a push-based, publish-subscribe model where events are pushed to subscribers via webhooks or event handlers — no polling required. (C) Azure Service Bus topics implement durable publish-subscribe messaging where multiple subscribers receive copies of each message via subscriptions, with no need to poll. Azure Queue Storage and Event Hubs are pull-based.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/event-grid/compare-messaging-services',
  },
  {
    seq: 346,
    options: [
      { text: 'subscriptionClient.ReceiveAsync(TimeSpan.FromSeconds(5))' },
      { text: 'subscriptionClient.PeekAsync()' },
      { text: 'subscriptionClient.AbandonAsync(message.SystemProperties.LockToken)' },
      { text: 'subscriptionClient.RegisterMessageHandler(ProcessMessageAsync, messageHandlerOptions)' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'A Service Bus subscription client requires a message handler to be registered before it starts receiving messages. RegisterMessageHandler() registers an async callback (ProcessMessageAsync) and MessageHandlerOptions that control concurrency and error handling. Without this registration the client is initialised but not actively listening — which is why messages are visible in the portal but not consumed.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dotnet-get-started-with-topics-subscriptions',
  },
  {
    seq: 353,
    options: [
      { text: 'MongoDB API' },
      { text: 'Gremlin API' },
      { text: 'SQL (Core) API' },
      { text: 'Cassandra API' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'Azure Cosmos DB SQL (Core) API is the best choice for relational-style structured data with batch processing. It supports SQL query syntax for flexible queries, server-side transactions for batch operations, and JSON documents that can represent relational structures. Gremlin is for graph data, MongoDB is document-oriented with BSON, and Cassandra is for wide-column workloads.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/cosmos-db/choose-api',
  },
  {
    seq: 357,
    options: [
      { text: 'Azure Event Hubs' },
      { text: 'Azure Event Grid' },
      { text: 'Azure Service Bus' },
      { text: 'Azure Queue Storage' },
    ],
    correctAnswers: lettersToIndices('C'),
    explanation: 'Azure Service Bus is the correct choice for a transactional FIFO communication backplane. It natively supports sessions-based FIFO ordering (guaranteed delivery in order for a session), transactions (atomic send/receive), and reliable messaging semantics required between microservices. Event Hubs is for streaming/analytics, Event Grid is for events, and Queue Storage has limited transactional support.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions',
  },
  {
    seq: 361,
    options: [
      { text: 'Use the retailer unique identifier as the partition key when sending events' },
      { text: 'Create a separate Event Hubs namespace for each retailer' },
      { text: 'Assign a dedicated consumer group to each retailer' },
      { text: 'Use Event Hubs Capture to separate events by retailer into Azure Storage' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'Using the retailer unique identifier as the partition key routes all events for a specific retailer to the same partition. Each retailer can then be assigned a consumer that reads only their partition. This scales to 100 retailers (within Event Hubs partition limits), allows dynamic addition/removal of retailers without reconfiguration, and enforces that retailers can only read their own events.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features#partitions',
  },
  {
    seq: 363,
    options: [
      { text: 'Send a GET request to the Azure Instance Metadata Service (IMDS) endpoint at http://169.254.169.254/metadata/identity/oauth2/token' },
      { text: 'Call az login --identity using the Azure CLI on the VM' },
      { text: 'Use ManagedIdentityCredential or DefaultAzureCredential from the Azure SDK' },
      { text: 'Generate an access token using an Azure AD application client secret' },
    ],
    correctAnswers: lettersToIndices('AC'),
    explanation: '(A) The Azure Instance Metadata Service (IMDS) endpoint is available on every Azure VM and provides a REST API to obtain access tokens for the VM\'s managed identity without any credentials. (C) The Azure SDK\'s ManagedIdentityCredential (or DefaultAzureCredential which includes it) programmatically retrieves the managed identity token. Both are the standard approaches for code running on Azure VMs.',
    explanation_reference: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token',
  },
  {
    seq: 364,
    stripVotes: true,
    options: [
      { text: 'Create one Event Hubs namespace per road' },
      { text: 'Use separate consumer groups per road' },
      { text: 'Create separate Event Hub instances per road' },
      { text: 'Create an Application Group for each road and assign a throttling policy' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'Application Groups are an Event Hubs Premium/Dedicated tier feature that enables per-client throttling policies. Each road can be assigned its own Application Group with unique throttling limits (throughput policies). This provides granular, per-road rate limiting without requiring separate namespaces or Event Hub instances, which would be operationally complex at scale.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-application-groups',
  },
  {
    seq: 365,
    options: [
      { text: 'Set the connection string Connection Timeout parameter to a higher value' },
      { text: 'Use Azure Database for MySQL built-in automatic failover' },
      { text: 'Enable connection resiliency using Entity Framework Core EnableRetryOnFailure' },
      { text: 'Implement a retry policy using the Polly library with exponential backoff' },
      { text: 'Wrap database calls in a try/catch block and manually retry on MySqlException' },
    ],
    correctAnswers: lettersToIndices('CDE'),
    explanation: '(C) EF Core\'s EnableRetryOnFailure() automatically retries transient database failures using a configurable retry strategy built for MySQL. (D) Polly provides flexible retry policies (exponential backoff, circuit breaker) for any code path, not just EF Core. (E) Manually catching MySqlException and implementing retry in code is a valid approach. All three implement the retry pattern required for transient connection handling.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/mysql/flexible-server/concepts-connectivity',
  },
  {
    seq: 371,
    options: [
      { text: 'Advanced filter' },
      { text: 'Subject filter' },
      { text: 'Event type filter' },
      { text: 'Prefix filter' },
    ],
    correctAnswers: lettersToIndices('A'),
    explanation: 'Event Grid Advanced filters use key-value operators (NumberGreaterThan, StringContains, etc.) that can be dynamically adjusted without recreating the subscription. They can filter on event data properties such as product category or demand level, making them ideal for seasonally adjusting which inventory events are routed to which handlers. Subject, event type, and prefix filters are static and cannot express complex or changing conditions.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/event-grid/event-filtering',
  },
  {
    seq: 374,
    options: [
      { text: 'API revisions' },
      { text: 'API products' },
      { text: 'API policies' },
      { text: 'API versions' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'APIM Products are the entity that bundles one or more APIs with: subscription key requirement, terms of use (legal text subscribers must accept), administrator approval workflow (manual approval before access is granted), and subscription count limits. All four requirements map directly to Product configuration, not versions, revisions, or policies.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-add-products',
  },
  {
    seq: 377,
    options: [
      { text: 'Enable diagnostic logging for the APIM instance in Azure Monitor' },
      { text: 'Include the Ocp-Apim-Trace: true header in each REST client request' },
      { text: 'Retrieve the URL from the Ocp-Apim-Trace-Location response header and inspect it' },
      { text: 'Use the APIM test console in the Azure portal' },
      { text: 'Configure Application Insights integration for the APIM instance' },
    ],
    correctAnswers: lettersToIndices('ABC'),
    explanation: 'APIM request tracing is a three-step process: (A) Configure diagnostic logging in Azure Monitor to capture all request/response data including backend calls, policy execution, and errors. (B) Add the Ocp-Apim-Trace: true header to REST client requests to activate per-request tracing. (C) Read the Ocp-Apim-Trace-Location response header which contains a URL to the full trace JSON — showing backend requests, responses, applied policies, and any errors.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-api-inspector',
  },
  {
    seq: 381,
    options: [
      { text: 'Create a new API version' },
      { text: 'Update the API policy' },
      { text: 'Create a new API product' },
      { text: 'Create a new API revision' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'API Revisions in APIM are designed exactly for this scenario. A revision is a non-breaking variant of an existing API that existing callers continue to use uninterrupted. The revision can be tested independently before being made current. Changes can be rolled back by switching back to the previous revision. Each revision is automatically documented in the change log visible to developers in the Developer Portal.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/api-management/api-management-get-started-revise-api',
  },
  {
    seq: 392,
    options: [
      { text: 'Create an Azure Service Bus queue as the dead-letter destination' },
      { text: 'Create an Azure Storage account and add a blob container' },
      { text: 'Enable a system topic in Azure Event Grid' },
      { text: 'Assign a managed identity to the EventSub1 subscription' },
    ],
    correctAnswers: lettersToIndices('B'),
    explanation: 'Azure Event Grid dead-lettering requires an Azure Blob Storage container as the destination. When events cannot be delivered after retries, they are written to this blob container as JSON files. You must first create the storage account and blob container, then specify it as the dead-letter destination when enabling dead-lettering on EventSub1. Service Bus queues cannot be used as Event Grid dead-letter destinations.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/event-grid/manage-event-delivery',
  },
  {
    seq: 393,
    options: [
      { text: 'Set the partition key to the message ID' },
      { text: 'Set the partition key to a fixed constant value' },
      { text: 'Set the partition key to the sender application identifier' },
      { text: 'Do not set a partition key — allow the broker to assign messages to partitions randomly' },
    ],
    correctAnswers: lettersToIndices('D'),
    explanation: 'When message order is random and minimizing transient failure impact is the priority, not setting a partition key causes the Service Bus broker to distribute messages evenly and randomly across all partitions. This means a transient failure in any single partition only affects a fraction of messages. Setting a fixed key would route all messages through one partition, making it a single point of failure.',
    explanation_reference: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-partitioning',
  },
]

// ── Apply fixes ────────────────────────────────────────────────────────────

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
const seqMap = new Map(data.map((q, i) => [q.sequential_number, i]))

let updated = 0
for (const fix of FIXES) {
  const idx = seqMap.get(fix.seq)
  if (idx === undefined) { console.warn('seq not found:', fix.seq); continue }

  const q = data[idx]
  if (fix.stripVotes) q.question_text = stripVotes(q.question_text)
  q.options = fix.options
  q.correctAnswers = fix.correctAnswers
  if (fix.explanation) q.explanation = fix.explanation
  if (fix.explanation_reference) q.explanation_reference = fix.explanation_reference
  updated++
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2))
console.log(`Updated ${updated} questions.`)

// Verify a couple
const sample = [11, 72, 341, 377].map(s => {
  const q = data[seqMap.get(s)]
  return `Q${s}: ${q.options.length} options, correctAnswers=${JSON.stringify(q.correctAnswers)}`
})
console.log('Spot-check:', sample.join(' | '))
