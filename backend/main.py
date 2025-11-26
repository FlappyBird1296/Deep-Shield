from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from inference import analyze_image_bytes, analyze_video_file

app = FastAPI(title="DeepShield API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    content = await file.read()
    try:
        res = analyze_image_bytes(content)
        return JSONResponse(content=res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    # save temporarily and run
    tmp_path = f"temp_{file.filename}"
    content = await file.read()
    with open(tmp_path, "wb") as f:
        f.write(content)
    try:
        res = analyze_video_file(tmp_path)
        import json

        print("\n=== RAW PYTHON RES ===")
        print(res)

        safe_json = json.loads(json.dumps(res, default=str))

        print("\n=== JSON SENT TO FRONTEND ===")
        print(json.dumps(safe_json, indent=2))

        return JSONResponse(content=safe_json)


    finally:
        import os
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
