
import requests
import json

BASE_URL = "http://localhost:8000/api"

import time

def test_recommendations():
    # 1. Login
    login_data = {
        "email": "test@example.com",
        "password": "password123" # Assuming this is the password for the test user
    }
    
    # Wait, I don't know the password. Let's register a new user instead.
    email = f"test_{int(time.time())}@gmail.com"
    reg_data = {
        "email": email,
        "password": "Password123!"
    }
    
    print(f"Registering user: {email}")
    resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if resp.status_code != 200:
        print(f"Registration failed: {resp.text}")
        return

    # 2. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json=reg_data)
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Update Profile (Required for recommendations)
    print("Updating profile...")
    profile_data = {
        "skills": ["python", "fastapi", "react"],
        "target_roles": ["Backend Developer", "Fullstack Developer"],
        "education": "btech",
        "preferred_sector": "cse"
    }
    resp = requests.put(f"{BASE_URL}/user/profile/update", json=profile_data, headers=headers)
    if resp.status_code != 200:
        print(f"Profile update failed: {resp.text}")
        return

    # 4. Get Recommendations
    print("Fetching recommendations...")
    resp = requests.post(f"{BASE_URL}/recommend/", json={}, headers=headers)
    print(f"Status Code: {resp.status_code}")
    print(f"Response: {json.dumps(resp.json(), indent=2)}")

if __name__ == "__main__":
    try:
        test_recommendations()
    except Exception as e:
        print(f"Error: {e}")
