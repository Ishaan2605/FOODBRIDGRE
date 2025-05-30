from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai.verify_user_trust import router as custom_request_router  # Ensure correct relative path

app = FastAPI()

# 🔓 Allow requests from frontend (Next.js at localhost:3000 or Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:3000"] if you want to restrict to local frontend only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register all routers
app.include_router(custom_request_router)
