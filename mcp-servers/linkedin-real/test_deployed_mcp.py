#!/usr/bin/env python3
"""
Fixed test script for deployed LinkedIn MCP Server - no KeyError issues
"""

import requests
import json
import sys
import time
from typing import Dict, Any, Optional

def test_endpoint(url: str, method: str = "GET", data: Optional[Dict[Any, Any]] = None, description: str = "") -> Dict[str, Any]:
    """Test a single endpoint and return detailed results"""
    result = {
        "success": False,
        "status_code": None,
        "response": None,
        "error": None,
        "response_time": None
    }
    
    try:
        print(f"🧪 Testing {description}...")
        print(f"   URL: {url}")
        
        start_time = time.time()
        
        if method.upper() == "GET":
            response = requests.get(url, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=30)
        else:
            result["error"] = f"Unsupported method: {method}"
            return result
        
        result["response_time"] = round(time.time() - start_time, 2)
        result["status_code"] = response.status_code
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Time: {result['response_time']}s")
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                result["response"] = json_response
                result["success"] = True
                print(f"   Response: {json.dumps(json_response, indent=2)}")
            except json.JSONDecodeError:
                result["response"] = response.text
                result["success"] = True
                print(f"   Response (text): {response.text[:200]}...")
        else:
            result["error"] = f"HTTP {response.status_code}: {response.text[:200]}"
            print(f"   Error: {result['error']}")
            
    except requests.exceptions.Timeout:
        result["error"] = "Request timeout (>30s)"
    except requests.exceptions.ConnectionError:
        result["error"] = "Connection error - server not reachable"
    except Exception as e:
        result["error"] = f"Unexpected error: {str(e)}"
    
    return result

def print_test_result(test_name: str, result: Dict[str, Any]) -> None:
    """Print test result in a consistent format"""
    if result["success"]:
        print(f"✅ PASS {test_name}")
        print(f"   Status: {result['status_code']}")
        print(f"   Response time: {result['response_time']}s")
        
        # Extract specific info based on endpoint
        if isinstance(result["response"], dict):
            if "status" in result["response"]:
                print(f"   Server status: {result['response']['status']}")
            if "connected" in result["response"]:
                print(f"   MCP connected: {result['response']['connected']}")
            if "mcp_server" in result["response"]:
                print(f"   MCP server type: {result['response']['mcp_server']}")
    else:
        print(f"❌ FAIL {test_name}")
        if result["error"]:
            print(f"   Error: {result['error']}")
        if result["status_code"]:
            print(f"   Status Code: {result['status_code']}")

def main():
    """Run comprehensive tests against deployed MCP server"""
    
    # Get server URL from user or use default
    server_url = input("Enter your Container Apps URL (or press Enter for default): ").strip()
    if not server_url:
        server_url = "https://linkedin-mcp-server.azurecontainerapps.io"
    
    # Remove trailing slash
    server_url = server_url.rstrip('/')
    
    print("\n🚀 Testing Deployed LinkedIn MCP Server")
    print("=" * 50)
    print(f"🌐 Server URL: {server_url}")
    print()
    
    # Test results tracking
    tests = []
    test_names = []
    
    # Test 1: Health Check
    print("📋 Basic Server Tests")
    print("-" * 20)
    result = test_endpoint(f"{server_url}/health", description="Health Check")
    tests.append(result)
    test_names.append("Health Check")
    print_test_result("Health Check", result)
    print()
    
    # Test 2: MCP Status
    result = test_endpoint(f"{server_url}/api/mcp/status", description="MCP Status")
    tests.append(result)
    test_names.append("MCP Status")
    print_test_result("MCP Status", result)
    print()
    
    # Test 3: LinkedIn Summary (POST)
    print("📋 LinkedIn Integration Tests")
    print("-" * 30)
    username = input("Enter LinkedIn username to test (or press Enter for 'iarunpaul'): ").strip()
    if not username:
        username = "iarunpaul"
    
    result = test_endpoint(
        f"{server_url}/api/linkedin/summary",
        method="POST",
        data={"username": username},
        description="LinkedIn Summary Generation"
    )
    tests.append(result)
    test_names.append("LinkedIn Summary")
    print_test_result("LinkedIn Summary", result)
    print()
    
    # Test 4: LinkedIn Feed (if available)
    result = test_endpoint(
        f"{server_url}/api/linkedin/feed/{username}",
        description="LinkedIn Feed Access"
    )
    tests.append(result)
    test_names.append("LinkedIn Feed")
    print_test_result("LinkedIn Feed", result)
    print()
    
    # Test 5: LinkedIn Profile (if available)
    result = test_endpoint(
        f"{server_url}/api/linkedin/profile/{username}",
        description="LinkedIn Profile Access"
    )
    tests.append(result)
    test_names.append("LinkedIn Profile")
    print_test_result("LinkedIn Profile", result)
    print()
    
    # Summary
    print("📊 Test Results Summary")
    print("=" * 30)
    
    passed = sum(1 for test in tests if test["success"])
    total = len(tests)
    
    for i, (name, result) in enumerate(zip(test_names, tests)):
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        print(f"{i+1}. {name}: {status}")
    
    print()
    print(f"📈 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    # Specific diagnostics
    print("\n🔍 Diagnostic Information")
    print("=" * 30)
    
    # Check if server is reachable
    if tests[0]["success"]:  # Health check
        print("✅ Server is reachable and responding")
        
        # Check MCP connection status
        if tests[1]["success"]:  # MCP status
            mcp_response = tests[1]["response"]
            if isinstance(mcp_response, dict):
                if mcp_response.get("connected", False):
                    print("✅ MCP server is connected to LinkedIn")
                else:
                    print("⚠️ MCP server is running but not connected to LinkedIn")
                    print("   This usually means:")
                    print("   - LinkedIn credentials are incorrect")
                    print("   - LinkedIn is blocking automated access")
                    print("   - Rate limiting is in effect")
        else:
            print("❌ MCP status endpoint failed")
    else:
        print("❌ Server is not reachable")
        print("   Check if the Container App is running")
    
    # Recommendations
    print("\n💡 Next Steps")
    print("=" * 15)
    
    if passed == 0:
        print("🔧 Server appears to be down or unreachable")
        print("   1. Check Azure Container Apps status")
        print("   2. Verify the URL is correct")
        print("   3. Check container logs for errors")
    elif passed == 1:  # Only health check passed
        print("🔧 Server is running but MCP integration has issues")
        print("   1. Check container logs: az containerapp logs show --name linkedin-mcp-server --resource-group Pollys")
        print("   2. Verify LinkedIn credentials in GitHub secrets")
        print("   3. Check for authentication errors in logs")
    elif passed >= 2:
        print("🎉 Server is working! Some advanced features may need configuration")
        if not tests[1]["response"].get("connected", False):
            print("   Focus on fixing LinkedIn connection for full functionality")
    
    return 0 if passed >= total // 2 else 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⏹️ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {str(e)}")
        sys.exit(1)

