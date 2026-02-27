
import requests
import json

BASE_URL = "http://localhost:8000/api"

def debug_recommendations():
    # Attempt to login as the admin or a test user
    # Since I don't know the password, I'll try to see if any user is already there
    # or just use the test user I created earlier if I can find its credentials.
    
    # Actually, I'll just check the health endpoint first
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

    # Check internships count
    try:
        resp = requests.get("http://localhost:8000/debug/internships-count")
        print(f"Internships count: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Debug internships failed: {e}")

if __name__ == "__main__":
    debug_recommendations()
