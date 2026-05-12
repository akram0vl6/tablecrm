"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { CartItem } from "@/types";

export function useTableCRM() {
  // ---------- состояния ----------
  const [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [payboxes, setPayboxes] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [priceTypes, setPriceTypes] = useState<any[]>([]);

  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedPaybox, setSelectedPaybox] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedPriceType, setSelectedPriceType] = useState("");

  const [phone, setPhone] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [clientError, setClientError] = useState("");

  const [searchProduct, setSearchProduct] = useState("");
  const [foundProducts, setFoundProducts] = useState<any[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productSearchOpen, setProductSearchOpen] = useState(false);

  const [comment, setComment] = useState("");

  const [loadingDictionaries, setLoadingDictionaries] = useState(false);
  const [dictionariesError, setDictionariesError] = useState("");
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [saleError, setSaleError] = useState("");
  const [saleSuccess, setSaleSuccess] = useState("");

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------- инициализация токена из localStorage ----------
  useEffect(() => {
    const saved = localStorage.getItem("tablecrm_token");
    if (saved) {
      setToken(saved);
      setIsConnected(true);
    }
  }, []);

  // ---------- загрузка справочников ----------
  useEffect(() => {
    if (!isConnected || !token) return;
    setLoadingDictionaries(true);
    setDictionariesError("");
    Promise.all([
      fetch(`/api/organizations?token=${token}`).then(r => r.json()),
      fetch(`/api/payboxes?token=${token}`).then(r => r.json()),
      fetch(`/api/warehouses?token=${token}`).then(r => r.json()),
      fetch(`/api/price_types?token=${token}`).then(r => r.json()),
    ])
      .then(([orgs, pboxes, wh, pt]) => {
        setOrganizations(orgs.result || []);
        setPayboxes(pboxes.result || []);
        setWarehouses(wh.result || []);
        setPriceTypes(pt.result || []);
      })
      .catch(() => setDictionariesError("Ошибка загрузки справочников"))
      .finally(() => setLoadingDictionaries(false));
  }, [isConnected, token]);

  // ---------- обработчики ----------
  const handleConnect = () => {
    if (!token.trim()) return;
    localStorage.setItem("tablecrm_token", token);
    setIsConnected(true);
  };

  const handleSearchClient = async () => {
    if (!phone.trim() || !token) return;
    setIsSearchingClient(true);
    setClientError("");
    try {
      const res = await fetch(`/api/contragents?phone=${encodeURIComponent(phone)}&token=${token}`);
      if (!res.ok) throw new Error("Ошибка поиска");
      const data = await res.json();
      if (data.result?.length > 0) setClient(data.result[0]);
      else {
        setClient(null);
        setClientError("Клиент не найден");
      }
    } catch {
      setClientError("Ошибка поиска");
    } finally {
      setIsSearchingClient(false);
    }
  };

  const handleSearchProducts = useCallback((query: string) => {
    setSearchProduct(query);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!query.trim() || !token) {
      setFoundProducts([]);
      setProductSearchOpen(false);
      return;
    }
    setIsSearchingProducts(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/nomenclature?search=${encodeURIComponent(query)}&token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setFoundProducts(data.result || []);
          setProductSearchOpen(true);
        }
      } catch {
        setFoundProducts([]);
      } finally {
        setIsSearchingProducts(false);
      }
    }, 500);
  }, [token]);

  const addToCart = (product: any) => {
    const idx = cartItems.findIndex(i => i.nomenclature_id === product.id);
    if (idx >= 0) {
      const updated = [...cartItems];
      updated[idx].quantity++;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, {
        nomenclature_id: product.id,
        name: product.name,
        price: product.price || 0,
        quantity: 1,
      }]);
    }
    setSearchProduct("");
    setFoundProducts([]);
    setProductSearchOpen(false);
  };

  const updateCartItemQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.nomenclature_id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const updateCartItemPrice = (id: number, newPrice: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.nomenclature_id === id ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
  };

  const removeCartItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.nomenclature_id !== id));
  };

  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateSale = async (conduct: boolean = false) => {
    if (!token || !selectedOrg || !selectedPaybox || !selectedWarehouse || !selectedPriceType) {
      setSaleError("Заполните все параметры продажи");
      return;
    }
    if (cartItems.length === 0) {
      setSaleError("Добавьте хотя бы один товар");
      return;
    }
    setIsCreatingSale(true);
    setSaleError("");
    setSaleSuccess("");
    try {
      const payload: any = {
        organization_id: Number(selectedOrg),
        paybox_id: Number(selectedPaybox),
        warehouse_id: Number(selectedWarehouse),
        price_type_id: Number(selectedPriceType),
        comment,
        items: cartItems.map(item => ({
          nomenclature_id: item.nomenclature_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      if (client) payload.client_id = client.id;
      if (conduct) payload.do_conduct = true;

      const res = await fetch(`/api/docs_sales?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Ошибка создания продажи");
      setSaleSuccess(`Продажа ${conduct ? "создана и проведена" : "создана"} успешно!`);
      setCartItems([]);
      setClient(null);
      setPhone("");
      setComment("");
    } catch (error: any) {
      setSaleError(error.message || "Произошла ошибка");
    } finally {
      setIsCreatingSale(false);
    }
  };

  return {
    // состояния
    token, setToken, isConnected,
    organizations, payboxes, warehouses, priceTypes,
    selectedOrg, setSelectedOrg, selectedPaybox, setSelectedPaybox,
    selectedWarehouse, setSelectedWarehouse, selectedPriceType, setSelectedPriceType,
    phone, setPhone, client, setClient, isSearchingClient, clientError,
    searchProduct, foundProducts, isSearchingProducts, cartItems, productSearchOpen, setProductSearchOpen,
    comment, setComment,
    loadingDictionaries, dictionariesError,
    isCreatingSale, saleError, saleSuccess,
    totalSum,
    // методы
    handleConnect, handleSearchClient, handleSearchProducts,
    addToCart, updateCartItemQuantity, updateCartItemPrice, removeCartItem,
    handleCreateSale,
  };
}