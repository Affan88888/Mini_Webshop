from fastapi import APIRouter, HTTPException
import json

router = APIRouter()

@router.get("/products")
def get_products():
    """
    Returna listu svih dostupnih produkata.
    Loada produkte iz 'data/products.json'.
    """
    with open("./data/products.json", "r") as f:
        products = json.load(f)
    return products

@router.get("/products/{product_id}")
def get_product(product_id: int):
    """
    Returna produkt sa odgovarajucim ID-om.
    Loada produkte iz 'data/products.json'.
    """
    with open("./data/products.json", "r") as f:
        products = json.load(f)
        
    #Pretrazi produkt sa odgovarajucim ID=om
    for product in products:
        if product["id"] == product_id:
            return product
        
    #Ako produkt nije pronadjen, 404 error se prikaze
    raise HTTPException(status_code=404, detail="Product not found")