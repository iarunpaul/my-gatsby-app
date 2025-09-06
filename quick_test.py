#!/usr/bin/env python3
"""
Quick Test for LinkedIn MCP Installation
Simple test to verify everything is working
"""

def quick_test():
    print("🧪 Quick LinkedIn MCP Test")
    print("=" * 30)
    
    # Test 1: Import LinkedIn MCP
    print("\n1. Testing LinkedIn MCP import...")
    try:
        import mcp_linkedin
        print("   ✅ LinkedIn MCP imported successfully")
    except ImportError as e:
        print(f"   ❌ Failed to import LinkedIn MCP: {e}")
        return False
    
    # Test 2: Import web dependencies
    print("\n2. Testing web server dependencies...")
    try:
        import fastapi
        import uvicorn
        import anthropic
        from dotenv import load_dotenv
        print("   ✅ All web dependencies available")
    except ImportError as e:
        print(f"   ❌ Missing dependency: {e}")
        return False
    
    # Test 3: Check environment
    print("\n3. Testing environment configuration...")
    try:
        load_dotenv()
        import os
        
        linkedin_email = os.getenv("LINKEDIN_EMAIL")
        linkedin_password = os.getenv("LINKEDIN_PASSWORD")
        
        if linkedin_email and linkedin_password:
            print("   ✅ LinkedIn credentials configured")
        else:
            print("   ⚠️  LinkedIn credentials need to be updated in .env")
        
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        if anthropic_key and anthropic_key.startswith("sk-ant-"):
            print("   ✅ Anthropic API key configured")
        else:
            print("   ⚠️  Anthropic API key needs to be updated in .env")
            
    except Exception as e:
        print(f"   ❌ Environment error: {e}")
        return False
    
    # Test 4: Test basic FastAPI setup
    print("\n4. Testing FastAPI setup...")
    try:
        from fastapi import FastAPI
        app = FastAPI()
        print("   ✅ FastAPI app can be created")
    except Exception as e:
        print(f"   ❌ FastAPI error: {e}")
        return False
    
    print("\n🎉 Quick test completed successfully!")
    print("\n✅ Your LinkedIn MCP installation is ready!")
    print("\n📋 What's working:")
    print("   - LinkedIn MCP server installed")
    print("   - Web server dependencies available")
    print("   - Environment configuration loaded")
    print("   - FastAPI ready for web server")
    
    print("\n🚀 Ready for next steps:")
    print("   1. Update credentials in .env file")
    print("   2. Create web_server.py with real MCP code")
    print("   3. Start server: python web_server.py")
    
    return True

if __name__ == "__main__":
    quick_test()

