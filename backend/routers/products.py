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
    sort_by: Optional[str] = Query("date"),  # sortiranje po: "date", "price", "quantity"
    order: Optional[str] = Query("desc")  # redoslijed sortiranja: "asc" ili "desc"
):
    """
    Vraća listu svih proizvoda sa opcijama filtriranja i sortiranja.
    """
    try:
        with open(PRODUCTS_PATH, "r") as f:
            products = json.load(f)
    except FileNotFoundError:
        return []
    
    # Filtriranje po zadanim parametrima
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
    
    # Sortiranje rezultata po odabranom kriteriju
    reverse = True if order == "desc" else False
    if sort_by in ["date", "price", "quantity"]:
        products.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
    
    return products

@router.get("/products/{product_id}")
def get_product(product_id: str):
    """
    Vraća jedan proizvod sa odgovarajućim ID-om.
    Ako proizvod nije pronađen, vraća 404 grešku.
    """
    with open(PRODUCTS_PATH, "r") as f:
        products = json.load(f)
    
    # Pretraga proizvoda po ID-u
    for product in products:
        if product["id"] == product_id:
            return product
    
    # Ako proizvod nije pronađen
    raise HTTPException(status_code=404, detail="Proizvod nije pronađen")

@router.post("/create-product")
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    quantity: int = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...)
):
    """
    Kreira novi proizvod i sprema ga u JSON fajl.
    Slika se također sprema na disk.
    """
    # Generisanje jedinstvenog ID-a i putanje slike
    product_id = str(uuid.uuid4())
    image_path = os.path.join(IMAGES_FOLDER, f"{product_id}_{image.filename}")

    # Spremanje slike na disk
    with open(image_path, "wb") as f:
        f.write(await image.read())
    
    # Kreiranje novog proizvoda
    new_product = {
        "id": product_id,
        "name": name,
        "description": description,
        "quantity": quantity,
        "price": price,
        "image_url": image_path.replace("\\", "/"),
        "date": datetime.now().isoformat(timespec="seconds")
    }

    # Čitanje postojećih proizvoda ako postoje
    try:
        with open(PRODUCTS_PATH, "r") as f:
            products = json.load(f)
    except FileNotFoundError:
        products = []
    
    # Dodavanje novog proizvoda u listu
    products.append(new_product)

    # Spremanje ažurirane liste proizvoda
    with open(PRODUCTS_PATH, "w") as f:
        json.dump(products, f, indent=4)
    
    return {"message": "Proizvod je uspješno kreiran", "product": new_product}

@router.delete("/products/{product_id}")
def delete_product(product_id: str):
    """
    Briše proizvod sa odgovarajucim ID-u iz JSON fajla i briše sliku proizvoda ako postoji.
    """
    try:
        # Pokušaj učitavanja postojeće liste proizvoda iz fajla
        with open(PRODUCTS_PATH, "r") as f:
            products = json.load(f)
    except FileNotFoundError:
        # Ako fajl ne postoji, vraća se greška da nema nijednog proizvoda
        raise HTTPException(status_code=404, detail="Nema pronađenih proizvoda")

    product_to_delete = None

    # Pronalaženje proizvoda koji se treba obrisati po ID-u
    for product in products:
        if product["id"] == product_id:
            product_to_delete = product
            break

    # Ako proizvod nije pronađen, vraća se greška
    if not product_to_delete:
        raise HTTPException(status_code=404, detail="Proizvod nije pronađen")

    # Uklanjanje proizvoda iz liste
    products.remove(product_to_delete)

    # Brisanje slike ako postoji i ako je putanja validna
    image_path = product_to_delete.get("image_url", "")
    if image_path and os.path.exists(image_path):
        os.remove(image_path)

    # Spremanje nove liste proizvoda nazad u fajl
    with open(PRODUCTS_PATH, "w") as f:
        json.dump(products, f, indent=4)

    # Vraćanje poruke o uspješnom brisanju
    return {"message": f"Proizvod sa ID-em {product_id} je obrisan."}

@router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    quantity: Optional[int] = Form(None),
    price: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Ažurira podatke o proizvodu sa zadanim ID-em. Moguće je ažurirati ime, opis, količinu, cijenu i sliku.
    Ako proizvod ne postoji, vraća se greška 404.
    """
    try:
        # Učitavanje postojećih proizvoda iz fajla
        with open(PRODUCTS_PATH, "r") as f:
            products = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Nema pronađenih proizvoda")

    # Traženje proizvoda po ID-u
    product_to_update = None
    for product in products:
        if product["id"] == product_id:
            product_to_update = product
            break

    if not product_to_update:
        raise HTTPException(status_code=404, detail="Proizvod nije pronađen")

    # Ažuriranje vrijednosti ako su nove vrijednosti dostavljene
    if name is not None:
        product_to_update["name"] = name
    if description is not None:
        product_to_update["description"] = description
    if quantity is not None:
        product_to_update["quantity"] = quantity
    if price is not None:
        product_to_update["price"] = price

    # Ako je dostavljena nova slika, prethodna se briše i nova se sprema
    if image:
        # Brisanje stare slike ako postoji
        old_image_path = product_to_update.get("image_url", "")
        if old_image_path and os.path.exists(old_image_path):
            os.remove(old_image_path)

        # Spremanje nove slike
        new_image_path = os.path.join(IMAGES_FOLDER, f"{product_id}_{image.filename}")
        with open(new_image_path, "wb") as f:
            f.write(await image.read())
        product_to_update["image_url"] = new_image_path.replace("\\", "/")

    # Spremanje ažurirane liste proizvoda
    with open(PRODUCTS_PATH, "w") as f:
        json.dump(products, f, indent=4)

    return {"message": f"Proizvod sa ID-em {product_id} je uspješno ažuriran.", "product": product_to_update}
