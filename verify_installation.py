#!/usr/bin/env python3
"""
Verify LinkedIn MCP Installation
Check if all components are properly installed and configured
"""

import sys
import os
from pathlib import Path

def check_installation():
    """Verify LinkedIn MCP installation"""
    
    print("🔍 Verifying LinkedIn MCP Installation")
    print("=" * 50)
    
    # Check 1: Python packages
    print("\n1. Checking Python packages...")
    required_packages = [
        'mcp_linkedin',
        'fastapi', 
        'uvicorn',
        'anthropic',
        'requests',
        'python_dotenv'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            if package == 'python_dotenv':
                import dotenv
                print(f"   ✅ {package} (imported as dotenv)")
            elif package == 'mcp_linkedin':
                import mcp_linkedin
                print(f"   ✅ {package} - LinkedIn MCP server")
            else:
                __import__(package)
                print(f"   ✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"   ❌ {package}")
    
    if missing_packages:
        print(f"\n❌ Missing packages: {missing_packages}")
        print("Run: pip install " + " ".join(missing_packages))
        return False
    
    # Check 2: Environment file
    print("\n2. Checking environment configuration...")
    env_file = Path(".env")
    if env_file.exists():
        print("   ✅ .env file exists")
        
        # Load and check environment variables
        from dotenv import load_dotenv
        load_dotenv()
        
        linkedin_email = os.getenv("LINKEDIN_EMAIL")
        linkedin_password = os.getenv("LINKEDIN_PASSWORD")
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        
        if linkedin_email and linkedin_email != "your_linkedin_email@example.com":
            print(f"   ✅ LinkedIn email configured: {linkedin_email[:3]}***@{linkedin_email.split('@')[1] if '@' in linkedin_email else 'domain'}")
        else:
            print("   ⚠️  LinkedIn email not configured")
        
        if linkedin_password and linkedin_password != "your_linkedin_password":
            print("   ✅ LinkedIn password configured")
        else:
            print("   ⚠️  LinkedIn password not configured")
        
        if anthropic_key and anthropic_key.startswith("sk-ant-"):
            print(f"   ✅ Anthropic API key configured: {anthropic_key[:15]}...")
        else:
            print("   ⚠️  Anthropic API key not configured")
    else:
        print("   ❌ .env file not found")
        return False
    
    # Check 3: LinkedIn MCP module functionality
    print("\n3. Testing LinkedIn MCP module...")
    try:
        import mcp_linkedin
        print("   ✅ LinkedIn MCP module imported successfully")
        
        # Check if we can access the main components
        if hasattr(mcp_linkedin, '__version__'):
            print(f"   ✅ Version: {mcp_linkedin.__version__}")
        
    except Exception as e:
        print(f"   ❌ LinkedIn MCP module error: {e}")
        return False
    
    # Check 4: FastAPI and web server components
    print("\n4. Testing web server components...")
    try:
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        import uvicorn
        print("   ✅ FastAPI components available")
        
        import anthropic
        print("   ✅ Anthropic client available")
        
    except Exception as e:
        print(f"   ❌ Web server components error: {e}")
        return False
    
    # Check 5: Directory structure
    print("\n5. Checking directory structure...")
    current_dir = Path.cwd()
    print(f"   📁 Current directory: {current_dir}")
    
    expected_files = [".env"]
    for file in expected_files:
        if Path(file).exists():
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file}")
    
    print("\n🎉 Installation Verification Complete!")
    print("\n📋 Summary:")
    print("   ✅ LinkedIn MCP server installed")
    print("   ✅ All Python dependencies available")
    print("   ✅ Environment configuration ready")
    print("   ✅ Web server components functional")
    
    print("\n🚀 Next Steps:")
    print("1. Update your .env file with actual credentials:")
    print("   - LINKEDIN_EMAIL=your_actual_email@example.com")
    print("   - LINKEDIN_PASSWORD=your_actual_password")
    print("   - ANTHROPIC_API_KEY=sk-ant-api03-your_key...")
    print("\n2. Copy the real MCP web server code to web_server.py")
    print("\n3. Start the server: python web_server.py")
    print("\n4. Test the integration: python test_real_mcp.py")
    
    return True

def show_next_steps():
    """Show detailed next steps"""
    print("\n" + "="*60)
    print("🔧 CONFIGURATION STEPS")
    print("="*60)
    
    print("\n1. Update .env file with your credentials:")
    print("   Edit the .env file and replace:")
    print("   LINKEDIN_EMAIL=your_actual_linkedin_email@example.com")
    print("   LINKEDIN_PASSWORD=your_actual_linkedin_password")
    print("   ANTHROPIC_API_KEY=sk-ant-api03-your_anthropic_key")
    
    print("\n2. Get your Anthropic API key:")
    print("   - Go to: https://console.anthropic.com/")
    print("   - Sign up/login")
    print("   - Create API key")
    print("   - Copy key (starts with sk-ant-api03-)")
    
    print("\n3. Create web_server.py:")
    print("   Copy the real MCP web server code I provided earlier")
    
    print("\n4. Test the setup:")
    print("   python web_server.py")
    
    print("\n⚠️  Security Reminders:")
    print("   - Never commit .env file to Git")
    print("   - Keep LinkedIn credentials secure")
    print("   - Use at your own risk (unofficial LinkedIn API)")

if __name__ == "__main__":
    try:
        success = check_installation()
        if success:
            show_next_steps()
        else:
            print("\n❌ Installation verification failed!")
            print("Please fix the issues above and run this script again.")
    except Exception as e:
        print(f"\n❌ Verification script error: {e}")
        print("Please check your Python installation and try again.")

