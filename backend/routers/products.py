import json
import os
import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form

router = APIRouter()
PRODUCTS_PATH = os.path.join("data", "products.json")
IMAGES_FOLDER = os.path.join("data", "images")
os.makedirs(IMAGES_FOLDER, exist_ok=True)

@router.get("/products")
def get_products(
    name: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_quantity: Optional[int] = Query(None),
    max_quantity: Optional[int] = Query(None),
    sort_by: Optional[str] = Query("date"),  # "date", "price", "quantity"
    order: Optional[str] = Query("desc")  # "asc" ili "desc"
):
    try:
        with open(PRODUCTS_PATH, "r") as f:
            products=json.load(f)
    except FileNotFoundError:
        return []
    
    #Filtering
    if name:
        products = [p for p in products if name.lower() in p["name"].lower()]
    if min_price is not None:
        products = [p for p in products if p["price"] >= min_price]
    if max_price is not None:
        products = [p for p in products if p["price"] <= max_price]
    if min_quantity is not None:
        products = [p for p in products if p["quantity"] >= min_quantity]
    if max_quantity is not None:
        products = [p for p in products if p["quantity"] <= max_quantity]
    
    #Sorting
    reverse = True if order == "desc" else False
    if sort_by in ["date", "price", "quantity"]:
        products.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
    
    return products

@router.get("/products/{product_id}")
def get_product(product_id: int):
    """
    Returna produkt sa odgovarajucim ID-om.
    Loada produkte iz 'data/products.json'.
    """
    with open(PRODUCTS_PATH, "r") as f:
        products = json.load(f)
        
    #Pretrazi produkt sa odgovarajucim ID=om
    for product in products:
        if product["id"] == product_id:
            return product
        
    #Ako produkt nije pronadjen, 404 error se prikaze
    raise HTTPException(status_code=404, detail="Product not found")

@router.post("/create-product")
async def create_product(
    name: str =  Form(...),
    description: str = Form(...),
    quantity: int = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...)
):
    product_id = str(uuid.uuid4())
    image_path = os.path.join(IMAGES_FOLDER, f"{product_id}_{image.filename}")

    with open(image_path, "wb") as f:
        f.write(await image.read())
    
    new_product = {
        "id": product_id,
        "name": name,
        "description": description,
        "quantity": quantity,
        "price": price,
        "image_url": image_path.replace("\\", "/"),
        "date": datetime.now().isoformat(timespec="seconds")
    }

    try:
        with open(PRODUCTS_PATH, "r") as f:
            products = json.load(f)
    except FileNotFoundError:
        products = []
    
    products.append(new_product)

    with open(PRODUCTS_PATH, "w") as f:
        json.dump(products, f, indent=4)
    
    return {"message": "Product created", "product": new_product}