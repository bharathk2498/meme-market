from fastapi import APIRouter
from app.core.database import supabase

router = APIRouter()

@router.get("/")
async def health_check():
    try:
        response = supabase.table("posts").select("id").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status
    }