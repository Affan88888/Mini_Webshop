import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from routers import products
from routers import auth
from routers import orders

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mini-webshop-taupe.vercel.app/"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.products_router)
app.include_router(auth.auth_router)
app.include_router(orders.orders_router)

# Serve-a 'data/images' na '/data/images' URL path-u
app.mount("/data/images", StaticFiles(directory=os.path.join("data", "images")), name="images")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
