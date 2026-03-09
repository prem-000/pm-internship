from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..utils.auth_deps import get_current_user
from ..services.resume_service import ResumeService
from ..services.profile_updater import ProfileUpdater
from typing import Dict, Any, List
import os

router = APIRouter(prefix="/profile", tags=["Resume"])
resume_service = ResumeService()

@router.post("/parse-resume")
async def parse_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Step 1: Extract information from a PDF/DOCX resume.
    Returns parsed data for frontend review, does NOT update database.
    """
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.pdf', '.docx']:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    try:
        # Read file content
        content = await file.read()
        
        # Process resume using service logic
        parsed_data = await resume_service.process_resume(content, file.filename)
        
        if not parsed_data:
            raise HTTPException(status_code=422, detail="Could not extract text from the resume.")
            
        return {
            "status": "success",
            "message": "Resume parsed successfully. Please review the data.",
            "data": parsed_data
        }
    except Exception as e:
        print(f"Resume Parsing Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@router.post("/confirm-resume-data")
async def confirm_resume_data(
    validated_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    Step 2: Confirm and save the extracted data.
    Applies HPIS merge rules and updates the user profile safely.
    """
    try:
        result = await ProfileUpdater.update_user_profile(current_user["email"], validated_data)
        return {
            "status": "success",
            "message": "Profile updated successfully.",
            "profile_completion": result["profile_completion"]
        }
    except Exception as e:
        print(f"Resume Confirmation Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error updated profile: {str(e)}")
