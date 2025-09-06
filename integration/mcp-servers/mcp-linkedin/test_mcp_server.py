#!/usr/bin/env python3
"""
Test script for LinkedIn MCP Server with Claude Integration
"""

import requests
import json
import time
from typing import Dict, Any

# Server configuration
BASE_URL = "http://localhost:8001"
TEST_USERNAME = "arun-paul-polly-741042b9"

def test_endpoint(method: str, endpoint: str, data: Dict[Any, Any] = None) -> Dict[str, Any]:
    """Test a single endpoint and return results"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=30)
        else:
            return {"success": False, "error": f"Unsupported method: {method}"}
        
        return {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text,
            "response_time": response.elapsed.total_seconds()
        }
        
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Connection failed - is the server running?"}
    except requests.exceptions.Timeout:
        return {"success": False, "error": "Request timeout"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def print_test_result(test_name: str, result: Dict[str, Any]):
    """Print formatted test results"""
    status = "✅ PASS" if result["success"] else "❌ FAIL"
    print(f"\n{status} {test_name}")
    
    if result["success"]:
        print(f"   Status: {result['status_code']}")
        print(f"   Response time: {result['response_time']:.2f}s")
        
        # Print relevant data
        data = result.get("data", {})
        if isinstance(data, dict):
            if "status" in data:
                print(f"   Server status: {data['status']}")
            if "mcp_connected" in data:
                print(f"   MCP connected: {data['mcp_connected']}")
            if "claude_available" in data:
                print(f"   Claude available: {data['claude_available']}")
    else:
        print(f"   Error: {result['error']}")

def main():
    """Run comprehensive MCP server tests"""
    
    print("🧪 Testing LinkedIn MCP Server with Claude Integration")
    print("=" * 60)
    
    # Test 1: Basic health check
    print("\n📋 Basic Server Tests")
    result = test_endpoint("GET", "/health")
    print_test_result("Health Check", result)
    
    # Test 2: Root endpoint
    result = test_endpoint("GET", "/")
    print_test_result("Root Endpoint", result)
    
    # Test 3: MCP Status
    print("\n🔗 MCP Integration Tests")
    result = test_endpoint("GET", "/api/mcp/status")
    print_test_result("MCP Status", result)
    
    # Test 4: MCP Connection
    result = test_endpoint("POST", "/api/mcp/connect")
    print_test_result("MCP Connect", result)
    
    # Test 5: LinkedIn Profile
    print("\n👤 LinkedIn Data Tests")
    result = test_endpoint("GET", f"/api/linkedin/profile/{TEST_USERNAME}")
    print_test_result("LinkedIn Profile", result)
    
    if result["success"]:
        profile_data = result["data"]
        print(f"   Profile name: {profile_data.get('name', 'N/A')}")
        print(f"   Headline: {profile_data.get('headline', 'N/A')}")
        print(f"   Connections: {profile_data.get('connections', 'N/A')}")
    
    # Test 6: LinkedIn Posts
    result = test_endpoint("GET", f"/api/linkedin/posts/{TEST_USERNAME}?limit=5")
    print_test_result("LinkedIn Posts", result)
    
    if result["success"]:
        posts_data = result["data"]
        posts = posts_data.get("posts", [])
        print(f"   Posts retrieved: {len(posts)}")
        if posts:
            print(f"   Latest post engagement: {posts[0].get('engagement', {}).get('total', 'N/A')}")
    
    # Test 7: LinkedIn Summary (Main MCP + Claude feature)
    print("\n🤖 AI-Powered Summary Tests")
    summary_request = {
        "username": TEST_USERNAME,
        "include_metrics": True,
        "include_themes": True,
        "include_topics": True,
        "max_posts": 5
    }
    
    print("   Generating AI summary (this may take 10-30 seconds)...")
    result = test_endpoint("POST", "/api/linkedin/summary", summary_request)
    print_test_result("LinkedIn AI Summary", result)
    
    if result["success"]:
        summary_data = result["data"]
        print(f"   MCP connected: {summary_data.get('mcp_connected', False)}")
        print(f"   Summary generated: {len(summary_data.get('summary_html', ''))} characters")
        print(f"   Raw data posts: {len(summary_data.get('raw_data', {}).get('recent_posts', []))}")
        
        # Show a snippet of the HTML summary
        html_summary = summary_data.get('summary_html', '')
        if html_summary:
            snippet = html_summary[:200] + "..." if len(html_summary) > 200 else html_summary
            print(f"   HTML snippet: {snippet}")
    
    # Test 8: Performance test
    print("\n⚡ Performance Tests")
    start_time = time.time()
    
    # Multiple quick requests
    quick_tests = []
    for i in range(3):
        result = test_endpoint("GET", "/health")
        quick_tests.append(result["success"])
    
    end_time = time.time()
    success_rate = sum(quick_tests) / len(quick_tests) * 100
    
    print(f"✅ Performance Test")
    print(f"   3 requests in {end_time - start_time:.2f}s")
    print(f"   Success rate: {success_rate:.1f}%")
    
    # Summary
    print("\n📊 Test Summary")
    print("=" * 60)
    
    # Test server capabilities
    status_result = test_endpoint("GET", "/api/mcp/status")
    if status_result["success"]:
        capabilities = status_result["data"].get("capabilities", [])
        print("🎯 Server Capabilities:")
        for capability in capabilities:
            print(f"   ✅ {capability}")
        
        endpoints = status_result["data"].get("endpoints", [])
        print("\n🌐 Available Endpoints:")
        for endpoint in endpoints:
            print(f"   📡 {endpoint}")
    
    print("\n🎉 Testing complete!")
    print("\nNext steps:")
    print("1. If all tests pass, your MCP server is ready!")
    print("2. Start Gatsby: gatsby develop")
    print("3. Visit http://localhost:8000 to see LinkedIn integration")
    print("4. Check browser console for any frontend errors")

if __name__ == "__main__":
    main()

