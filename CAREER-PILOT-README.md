# 🤖 AI Career Copilot - Gatsby Integration

A complete Gatsby integration for the AI Career Copilot, featuring a chat interface powered by Claude AI that intelligently routes user requests to career assistance tools.

## 🌟 Features

### **Intelligent Chat Interface**
- 💬 Natural language interaction with Claude AI
- 🎯 Automatic tool routing based on user intent
- 📱 Responsive design for all devices
- ⚡ Real-time responses with loading indicators

### **Career Tools**
- 🔍 **Job Search**: Multi-source job aggregation (RemoteOK, The Muse, Adzuna, LinkedIn)
- 📊 **Resume Scoring**: AI-powered compatibility analysis
- ✍️ **Cover Letter Generation**: Personalized professional letters
- 📱 **LinkedIn Post Creation**: Engaging social media content

### **Technical Features**
- 🚀 Built with Gatsby & React
- 🎨 Styled with Tailwind CSS
- 🤖 Powered by Anthropic Claude AI
- 📡 Real job board API integrations
- 🔄 Intelligent error handling and fallbacks

## 🚀 Quick Start

### **1. Installation**

```bash
# Clone or copy the integration files to your Gatsby project
npm install

# Install additional dependencies
npm install @anthropic-ai/sdk axios react-helmet
```

### **2. Environment Setup**

```bash
# Copy environment template
cp .env.example .env

# Add your API keys
ANTHROPIC_API_KEY=sk-ant-your-key-here
ADZUNA_APP_ID=your-adzuna-id (optional)
ADZUNA_APP_KEY=your-adzuna-key (optional)
```

### **3. Development**

```bash
# Start development server
npm run develop

# Visit the career copilot page
open http://localhost:8000/career-copilot
```

## 📁 Project Structure

```
src/
├── pages/
│   └── career-copilot.js          # Main chat interface page
├── api/
│   └── career-copilot.js          # Backend API with AI routing
├── styles/
│   └── global.css                 # Tailwind CSS + custom styles
├── components/
│   └── layout.js                  # Your existing layout component
gatsby-config.js                   # Gatsby configuration
tailwind.config.js                 # Tailwind CSS configuration
package.json                       # Dependencies
```

## 🎯 Usage Examples

### **Job Search**
```
User: "Find remote software engineer jobs"
AI: Searches multiple job boards and returns formatted results
```

### **Resume Scoring**
```
User: "Score my resume against these jobs"
AI: Analyzes compatibility and provides detailed scoring
```

### **Cover Letter**
```
User: "Write a cover letter for Senior Developer at TechCorp"
AI: Generates personalized, professional cover letter
```

### **LinkedIn Post**
```
User: "Create a LinkedIn post about completing a coding bootcamp"
AI: Creates engaging professional content with hashtags
```

## 🔧 Configuration

### **API Keys Setup**

#### **Anthropic API (Required)**
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account and get API key
3. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

#### **Adzuna API (Optional)**
1. Visit [Adzuna Developer](https://developer.adzuna.com/)
2. Sign up for free account (1000 calls/month)
3. Add to `.env`: `ADZUNA_APP_ID=...` and `ADZUNA_APP_KEY=...`

### **Customization**

#### **Styling**
- Modify `tailwind.config.js` for theme customization
- Update `src/styles/global.css` for custom styles
- Adjust colors and animations in the chat interface

#### **AI Behavior**
- Modify prompts in `src/api/career-copilot.js`
- Adjust tool routing logic
- Add new career tools or modify existing ones

#### **Job Sources**
- Add new job board APIs in the `CareerCopilotTools` class
- Modify job filtering and formatting logic
- Implement additional job sources

## 🧪 Testing

### **Manual Testing**
```bash
# Test the chat interface
1. Start development server
2. Navigate to /career-copilot
3. Try example prompts
4. Verify AI routing and responses
```

### **API Testing**
```bash
# Test API endpoints directly
curl -X POST http://localhost:8000/api/career-copilot \
  -H "Content-Type: application/json" \
  -d '{"message": "Find software engineer jobs"}'
```

## 🎨 UI Components

### **Chat Interface**
- **Message bubbles**: User and AI messages with distinct styling
- **Typing indicator**: Shows when AI is processing
- **Example prompts**: Quick-start buttons for new users
- **Tool indicators**: Shows which tool was used for each response

### **Features Grid**
- **Job Search**: Visual representation of multi-source search
- **Resume Scoring**: AI-powered analysis showcase
- **Cover Letters**: Professional writing capabilities
- **LinkedIn Posts**: Social media content creation

### **Technical Details**
- **Real-time updates**: Live conversation flow
- **Error handling**: Graceful failure management
- **Loading states**: User feedback during processing
- **Responsive design**: Works on all screen sizes

## 🚀 Deployment

### **Gatsby Build**
```bash
# Build for production
npm run build

# Serve locally to test
npm run serve
```

### **Environment Variables**
Ensure your deployment platform has the required environment variables:
- `ANTHROPIC_API_KEY` (required)
- `ADZUNA_APP_ID` (optional)
- `ADZUNA_APP_KEY` (optional)

### **Hosting Platforms**
- **Netlify**: Automatic deployment with environment variables
- **Vercel**: Serverless functions support
- **Gatsby Cloud**: Optimized Gatsby hosting
- **AWS/Azure**: Custom deployment options

## 🔍 Troubleshooting

### **Common Issues**

#### **"API key not found"**
```bash
# Check environment variables
echo $ANTHROPIC_API_KEY

# Verify .env file exists and has correct format
cat .env
```

#### **"No jobs found"**
- Job APIs may be rate-limited
- Try different keywords
- Check network connectivity
- Verify API endpoints are accessible

#### **"Chat not responding"**
- Check browser console for errors
- Verify API route is accessible
- Test with simple messages first
- Check Anthropic API quota/credits

### **Debug Mode**
```javascript
// Add to src/api/career-copilot.js for debugging
console.log('Request:', req.body)
console.log('Routing result:', routing)
console.log('Tool result:', result)
```

## 📈 Performance

### **Optimization Tips**
- **API Caching**: Implement Redis for job search results
- **Rate Limiting**: Add request throttling for production
- **Error Boundaries**: Implement React error boundaries
- **Loading States**: Optimize user experience during API calls

### **Monitoring**
- **API Usage**: Track Anthropic API consumption
- **Response Times**: Monitor tool execution times
- **Error Rates**: Track and alert on failures
- **User Engagement**: Analytics on tool usage

## 🔄 Updates & Maintenance

### **Regular Tasks**
- **API Key Rotation**: Update keys periodically
- **Dependency Updates**: Keep packages current
- **Job Source Monitoring**: Verify APIs still work
- **AI Prompt Optimization**: Improve routing accuracy

### **Feature Additions**
- **New Job Sources**: Add more job board integrations
- **Enhanced AI**: Upgrade to newer Claude models
- **User Accounts**: Add personalization features
- **Analytics**: Track usage and improve UX

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact for commercial support

---

**Built with ❤️ using Gatsby, React, Tailwind CSS, and Claude AI**

Your AI Career Copilot is ready to help users accelerate their careers! 🚀

