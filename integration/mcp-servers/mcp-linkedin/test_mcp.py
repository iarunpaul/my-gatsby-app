import requests
import json

def test_mcp_server():
    base_url = "http://localhost:8001"
    
    print("Testing LinkedIn MCP Server...")
    
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("Health check passed")
            print(f"Response: {response.json()}")
        else:
            print("Health check failed")
            return
    except Exception as e:
        print(f"Server not running: {e}")
        print("Make sure to start the server with: start_server.bat")
        return
    
    try:
        print("\nTesting LinkedIn summary generation...")
        response = requests.post(f"{base_url}/api/linkedin/summary", json={
            "username": "iarunpaul",
            "include_metrics": True,
            "include_themes": True,
            "include_topics": True,
            "max_posts": 10
        })
        
        if response.status_code == 200:
            data = response.json()
            print("LinkedIn summary generated successfully")
            print("Summary HTML preview:")
            html_preview = data["summary_html"][:300] + "..." if len(data["summary_html"]) > 300 else data["summary_html"]
            print(f"{html_preview}")
        else:
            print(f"Summary generation failed: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Summary test failed: {e}")
    
    print("\nTesting complete!")

if __name__ == "__main__":
    test_mcp_server()
