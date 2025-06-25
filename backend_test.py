import requests
import random
import string
import json
from datetime import datetime

class JobPortalAPITest:
    def __init__(self):
        self.base_url = "https://6f68fbd5-ce75-4ac3-a0c7-a15d5e146200.preview.emergentagent.com"
        self.token = None
        # Generate random test data
        self.random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        self.test_user = {
            "name": f"Test User {self.random_suffix}",
            "email": f"test{self.random_suffix}@example.com",
            "password": "TestPassword123!",
            "user_type": "applicant"
        }
        self.test_hirer = {
            "name": f"Test Hirer {self.random_suffix}",
            "email": f"hirer{self.random_suffix}@example.com",
            "password": "TestPassword123!",
            "user_type": "hirer"
        }
        self.test_freelancer = {
            "name": f"Test Freelancer {self.random_suffix}",
            "email": f"freelancer{self.random_suffix}@example.com",
            "password": "TestPassword123!",
            "user_type": "freelancer"
        }

    def test_01_health_check(self):
        """Test the health check endpoint"""
        print("\n🔍 Testing API health check...")
        response = requests.get(f"{self.base_url}/api/health")
        if response.status_code != 200:
            print(f"❌ API health check failed: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        if data["status"] != "healthy":
            print(f"❌ API health check failed: Expected status 'healthy', got '{data['status']}'")
            return False
            
        if "database" not in data:
            print("❌ API health check failed: 'database' field missing from response")
            return False
            
        if "timestamp" not in data:
            print("❌ API health check failed: 'timestamp' field missing from response")
            return False
            
        print("✅ API health check passed")
        return True

    def test_02_signup_applicant(self):
        """Test user registration for applicant"""
        print("\n🔍 Testing applicant signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json=self.test_user
        )
        if response.status_code != 200:
            print(f"❌ Applicant signup failed: Expected status code 200, got {response.status_code}")
            return False
            
        data = response.json()
        if "access_token" not in data:
            print("❌ Applicant signup failed: 'access_token' missing from response")
            return False
            
        if data["token_type"] != "bearer":
            print(f"❌ Applicant signup failed: Expected token_type 'bearer', got '{data['token_type']}'")
            return False
            
        if data["user"]["name"] != self.test_user["name"]:
            print(f"❌ Applicant signup failed: Name mismatch")
            return False
            
        if data["user"]["email"] != self.test_user["email"]:
            print(f"❌ Applicant signup failed: Email mismatch")
            return False
            
        if data["user"]["user_type"] != "applicant":
            print(f"❌ Applicant signup failed: Expected user_type 'applicant', got '{data['user']['user_type']}'")
            return False
            
        print("✅ Applicant signup passed")
        return data["access_token"]

    def test_03_signup_hirer(self):
        """Test user registration for hirer"""
        print("\n🔍 Testing hirer signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json=self.test_hirer
        )
        if response.status_code != 200:
            print(f"❌ Hirer signup failed: Expected status code 200, got {response.status_code}")
            return False
            
        data = response.json()
        if "access_token" not in data:
            print("❌ Hirer signup failed: 'access_token' missing from response")
            return False
            
        if data["user"]["user_type"] != "hirer":
            print(f"❌ Hirer signup failed: Expected user_type 'hirer', got '{data['user']['user_type']}'")
            return False
            
        print("✅ Hirer signup passed")
        return data["access_token"]

    def test_04_signup_freelancer(self):
        """Test user registration for freelancer"""
        print("\n🔍 Testing freelancer signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json=self.test_freelancer
        )
        if response.status_code != 200:
            print(f"❌ Freelancer signup failed: Expected status code 200, got {response.status_code}")
            return False
            
        data = response.json()
        if "access_token" not in data:
            print("❌ Freelancer signup failed: 'access_token' missing from response")
            return False
            
        if data["user"]["user_type"] != "freelancer":
            print(f"❌ Freelancer signup failed: Expected user_type 'freelancer', got '{data['user']['user_type']}'")
            return False
            
        print("✅ Freelancer signup passed")
        return data["access_token"]

    def test_05_signin(self):
        """Test user authentication"""
        print("\n🔍 Testing user signin...")
        response = requests.post(
            f"{self.base_url}/api/signin",
            json={
                "email": self.test_user["email"],
                "password": self.test_user["password"]
            }
        )
        if response.status_code != 200:
            print(f"❌ User signin failed: Expected status code 200, got {response.status_code}")
            return False
            
        data = response.json()
        if "access_token" not in data:
            print("❌ User signin failed: 'access_token' missing from response")
            return False
            
        if data["token_type"] != "bearer":
            print(f"❌ User signin failed: Expected token_type 'bearer', got '{data['token_type']}'")
            return False
            
        if data["user"]["email"] != self.test_user["email"]:
            print(f"❌ User signin failed: Email mismatch")
            return False
            
        self.token = data["access_token"]
        print("✅ User signin passed")
        return True

    def test_06_profile(self):
        """Test profile retrieval with token"""
        print("\n🔍 Testing profile retrieval...")
        # First sign in to get a token
        response = requests.post(
            f"{self.base_url}/api/signin",
            json={
                "email": self.test_user["email"],
                "password": self.test_user["password"]
            }
        )
        if response.status_code != 200:
            print(f"❌ Profile retrieval failed: Could not sign in to get token")
            return False
            
        token = response.json()["access_token"]
        
        # Now test profile endpoint
        response = requests.get(
            f"{self.base_url}/api/profile",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code != 200:
            print(f"❌ Profile retrieval failed: Expected status code 200, got {response.status_code}")
            return False
            
        data = response.json()
        if data["email"] != self.test_user["email"]:
            print(f"❌ Profile retrieval failed: Email mismatch")
            return False
            
        if data["name"] != self.test_user["name"]:
            print(f"❌ Profile retrieval failed: Name mismatch")
            return False
            
        if data["user_type"] != "applicant":
            print(f"❌ Profile retrieval failed: Expected user_type 'applicant', got '{data['user_type']}'")
            return False
            
        print("✅ Profile retrieval passed")
        return True

    def test_07_stats(self):
        """Test platform statistics"""
        print("\n🔍 Testing platform statistics...")
        response = requests.get(f"{self.base_url}/api/stats")
        if response.status_code != 200:
            print(f"❌ Platform statistics failed: Expected status code 200, got {response.status_code}")
            return False
            
        data = response.json()
        if "total_users" not in data:
            print("❌ Platform statistics failed: 'total_users' missing from response")
            return False
            
        if "hirers" not in data:
            print("❌ Platform statistics failed: 'hirers' missing from response")
            return False
            
        if "applicants" not in data:
            print("❌ Platform statistics failed: 'applicants' missing from response")
            return False
            
        if "freelancers" not in data:
            print("❌ Platform statistics failed: 'freelancers' missing from response")
            return False
            
        print("✅ Platform statistics passed")
        return True

    def test_08_invalid_signup(self):
        """Test invalid signup with missing fields"""
        print("\n🔍 Testing invalid signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json={
                "email": f"invalid{self.random_suffix}@example.com",
                "password": "password123"
                # Missing name and user_type
            }
        )
        if response.status_code == 200:
            print(f"❌ Invalid signup validation failed: Expected non-200 status code, got 200")
            return False
            
        print("✅ Invalid signup validation passed")
        return True

    def test_09_invalid_signin(self):
        """Test invalid signin with wrong credentials"""
        print("\n🔍 Testing invalid signin...")
        response = requests.post(
            f"{self.base_url}/api/signin",
            json={
                "email": self.test_user["email"],
                "password": "WrongPassword123!"
            }
        )
        if response.status_code != 401:
            print(f"❌ Invalid signin validation failed: Expected status code 401, got {response.status_code}")
            return False
            
        print("✅ Invalid signin validation passed")
        return True

    def test_10_unauthorized_profile(self):
        """Test unauthorized profile access"""
        print("\n🔍 Testing unauthorized profile access...")
        response = requests.get(
            f"{self.base_url}/api/profile",
            headers={"Authorization": "Bearer invalid_token"}
        )
        if response.status_code != 401:
            print(f"❌ Unauthorized profile access validation failed: Expected status code 401, got {response.status_code}")
            return False
            
        print("✅ Unauthorized profile access validation passed")
        return True

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("\n🚀 Starting JobPortal API Tests...\n")
        
        try:
            self.test_01_health_check()
            applicant_token = self.test_02_signup_applicant()
            hirer_token = self.test_03_signup_hirer()
            freelancer_token = self.test_04_signup_freelancer()
            self.test_05_signin()
            self.test_06_profile()
            self.test_07_stats()
            self.test_08_invalid_signup()
            self.test_09_invalid_signin()
            self.test_10_unauthorized_profile()
            
            print("\n✅ All API tests completed successfully!")
            return True
        except AssertionError as e:
            print(f"\n❌ Test failed: {str(e)}")
            return False
        except Exception as e:
            print(f"\n❌ Error during testing: {str(e)}")
            return False

if __name__ == "__main__":
    tester = JobPortalAPITest()
    tester.run_all_tests()