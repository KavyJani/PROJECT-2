import requests
import unittest
import random
import string
import json
from datetime import datetime

class JobPortalAPITest(unittest.TestCase):
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
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue("database" in data)
        self.assertTrue("timestamp" in data)
        print("✅ API health check passed")

    def test_02_signup_applicant(self):
        """Test user registration for applicant"""
        print("\n🔍 Testing applicant signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json=self.test_user
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("access_token" in data)
        self.assertEqual(data["token_type"], "bearer")
        self.assertEqual(data["user"]["name"], self.test_user["name"])
        self.assertEqual(data["user"]["email"], self.test_user["email"])
        self.assertEqual(data["user"]["user_type"], "applicant")
        print("✅ Applicant signup passed")
        return data["access_token"]

    def test_03_signup_hirer(self):
        """Test user registration for hirer"""
        print("\n🔍 Testing hirer signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json=self.test_hirer
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("access_token" in data)
        self.assertEqual(data["user"]["user_type"], "hirer")
        print("✅ Hirer signup passed")
        return data["access_token"]

    def test_04_signup_freelancer(self):
        """Test user registration for freelancer"""
        print("\n🔍 Testing freelancer signup...")
        response = requests.post(
            f"{self.base_url}/api/signup",
            json=self.test_freelancer
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("access_token" in data)
        self.assertEqual(data["user"]["user_type"], "freelancer")
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
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("access_token" in data)
        self.assertEqual(data["token_type"], "bearer")
        self.assertEqual(data["user"]["email"], self.test_user["email"])
        self.token = data["access_token"]
        print("✅ User signin passed")

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
        token = response.json()["access_token"]
        
        # Now test profile endpoint
        response = requests.get(
            f"{self.base_url}/api/profile",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], self.test_user["email"])
        self.assertEqual(data["name"], self.test_user["name"])
        self.assertEqual(data["user_type"], "applicant")
        print("✅ Profile retrieval passed")

    def test_07_stats(self):
        """Test platform statistics"""
        print("\n🔍 Testing platform statistics...")
        response = requests.get(f"{self.base_url}/api/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("total_users" in data)
        self.assertTrue("hirers" in data)
        self.assertTrue("applicants" in data)
        self.assertTrue("freelancers" in data)
        print("✅ Platform statistics passed")

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
        self.assertNotEqual(response.status_code, 200)
        print("✅ Invalid signup validation passed")

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
        self.assertEqual(response.status_code, 401)
        print("✅ Invalid signin validation passed")

    def test_10_unauthorized_profile(self):
        """Test unauthorized profile access"""
        print("\n🔍 Testing unauthorized profile access...")
        response = requests.get(
            f"{self.base_url}/api/profile",
            headers={"Authorization": "Bearer invalid_token"}
        )
        self.assertEqual(response.status_code, 401)
        print("✅ Unauthorized profile access validation passed")

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