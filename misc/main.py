from fastapi import FastAPI, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from utils.deepseek import DeepseekAgent

app = FastAPI()
agent = DeepseekAgent()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root():
    with open("templates/index.html") as f:
        return f.read()

@app.get("/code-review", response_class=HTMLResponse)
async def code_review_page():
    with open("templates/code_review.html") as f:
        return f.read()

@app.post("/review")
async def code_review(
    code: str = Form(...),
    context: str = Form("")
):
    try:
        return {"suggestions": agent.get_code_review(code, context)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
