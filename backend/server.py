from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import uuid
from typing import Optional

# Environment variables
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="JobPortal API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = MongoClient(MONGO_URL)
db = client.jobportal
users_collection = db.users

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Authentication
security = HTTPBearer()

# Pydantic models
class UserSignUp(BaseModel):
    name: str
    email: EmailStr
    password: str
    user_type: str  # 'hirer', 'applicant', 'freelancer'

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class User(BaseModel):
    id: str
    name: str
    email: str
    user_type: str
    created_at: datetime

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_collection.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    
    # Convert MongoDB document to User model
    user_dict = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "user_type": user["user_type"],
        "created_at": user["created_at"]
    }
    return User(**user_dict)

# API Endpoints
@app.get("/")
async def root():
    return {"message": "JobPortal API is running"}

@app.get("/api/health")
async def health_check():
    try:
        # Test database connection
        client.admin.command('ismaster')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.post("/api/signup", response_model=Token)
async def sign_up(user_data: UserSignUp):
    # Check if user already exists
    if users_collection.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate user type
    if user_data.user_type not in ['hirer', 'applicant', 'freelancer']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user type. Must be 'hirer', 'applicant', or 'freelancer'"
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    new_user = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "user_type": user_data.user_type,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    try:
        users_collection.insert_one(new_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    user_response = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "user_type": user_data.user_type,
        "created_at": new_user["created_at"]
    }
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.post("/api/signin", response_model=Token)
async def sign_in(user_credentials: UserSignIn):
    # Find user by email
    user = users_collection.find_one({"email": user_credentials.email})
    
    if not user or not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    user_response = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "user_type": user["user_type"],
        "created_at": user["created_at"]
    }
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.get("/api/profile", response_model=User)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/users")
async def get_users(current_user: User = Depends(get_current_user)):
    """Get all users (for admin purposes or testing)"""
    try:
        users = list(users_collection.find({}, {"password": 0}))  # Exclude passwords
        # Convert ObjectId to string and format response
        formatted_users = []
        for user in users:
            user_dict = {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "user_type": user["user_type"],
                "created_at": user["created_at"]
            }
            formatted_users.append(user_dict)
        
        return {
            "users": formatted_users,
            "total": len(formatted_users)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        )

@app.get("/api/stats")
async def get_platform_stats():
    """Get platform statistics"""
    try:
        total_users = users_collection.count_documents({})
        hirers = users_collection.count_documents({"user_type": "hirer"})
        applicants = users_collection.count_documents({"user_type": "applicant"})
        freelancers = users_collection.count_documents({"user_type": "freelancer"})
        
        return {
            "total_users": total_users,
            "hirers": hirers,
            "applicants": applicants,
            "freelancers": freelancers
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stats: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)