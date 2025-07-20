/*
 * CartContext.jsx
 *
 * Ovaj fajl definiše CartContext i omogućava funkcionalnost povezanu s korpom
 * širom React aplikacije koristeći React Context i localStorage.
 *
 */
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

//`CartProvider`: Komponenta koja pruža kontekst i omotava aplikaciju, omogućavajući pristup
// stanju korpe i funkcijama (dodavanje, uklanjanje, čišćenje).
// Korpa se čuva u `localStorage` pretraživača kako bi podaci ostali sačuvani čak i 
// nakon refreshanja stranice, zatvaranja taba ili ponovnog pokretanja applikacije.
// CartProvider se koristi u index.js fajlu
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
}, [cart]);

//`addToCart(product)`: Dodaje proizvod u korpu ili povećava količinu ako već postoji.
const addToCart = (product) => {
    setCart((prev) => {
        const exists = prev.find((item) => item.id === product.id);
        if (exists) {
            return prev.map((item) => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1} : item
            );
        }
        return [...prev, { ...product, quantity:1}];
    });
    console.log("Adding product: ", product);
};

//`removeFromCart(productId)`: Uklanja proizvod iz korpe pomoću njegovog ID-a.
const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
};

//`clearCart()`: Briše cijelu korpu.
const clearCart = () => setCart([]);

return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    ); 
};

//`useCart()`: Prilagođeni React hook za pristup podacima 
// iz korpe i njenim funkcijama iz bilo koje komponente.
export const useCart = () => useContext(CartContext)