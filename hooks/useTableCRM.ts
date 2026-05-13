"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { CartItem } from "@/types";

export function useTableCRM() {
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

  useEffect(() => {
    const saved = localStorage.getItem("tablecrm_token");
    if (saved) {
      setToken(saved);
      setIsConnected(true);
    }
  }, []);

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
          const allProducts = data.result || [];

          // КЛИЕНТСКАЯ ФИЛЬТРАЦИЯ — если API не фильтрует
          const filtered = allProducts.filter((product: any) =>
            product.name?.toLowerCase().includes(query.toLowerCase())
          );

          console.log(`🔍 Запрос: "${query}" | API вернул: ${allProducts.length} | После фильтра: ${filtered.length}`);

          setFoundProducts(filtered);
          setProductSearchOpen(filtered.length > 0);
        } else {
          setFoundProducts([]);
          setProductSearchOpen(false);
        }
      } catch {
        setFoundProducts([]);
        setProductSearchOpen(false);
      } finally {
        setIsSearchingProducts(false);
      }
    }, 500);
  }, [token])

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

  const MAX_PRICE_LENGTH = 6;
  const MAX_QUANTITY = 20;

  const updateCartItemPrice = (id: number, newPrice: number) => {

    let price = Math.round(newPrice * 100) / 100;

    const parts = price.toString().split('.');
    if (parts[0].length > MAX_PRICE_LENGTH) {
      parts[0] = parts[0].slice(0, MAX_PRICE_LENGTH);
      price = parseFloat(parts.join('.'));
    }


    price = Math.max(0, price);

    setCartItems(prev =>
      prev.map(item =>
        item.nomenclature_id === id ? { ...item, price } : item
      )
    );
  };

  const updateCartItemQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.nomenclature_id !== id) return item;
        const newQuantity = item.quantity + delta;
        return {
          ...item,
          quantity: Math.max(0, Math.min(newQuantity, MAX_QUANTITY))
        };
      }).filter(item => item.quantity > 0)
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
      const orderItem = {
        organization: Number(selectedOrg),
        warehouse: Number(selectedWarehouse),
        paybox: Number(selectedPaybox),
        comment: comment || "",
        goods: cartItems.map(item => ({
          nomenclature: Number(item.nomenclature_id),
          quantity: Number(item.quantity),
          price: Number(item.price),
          price_type: Number(selectedPriceType),
        })),
        ...(client?.id && { client: Number(client.id) }),
        ...(conduct && { generate_out: true }),
      };

      const payload = [orderItem];



      const res = await fetch(`/api/docs_sales?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = 'Ошибка создания продажи';
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err: any) =>
              err.loc ? `${err.loc.join(' → ')}: ${err.msg}` : JSON.stringify(err)
            ).join('; ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        }
        throw new Error(errorMessage);
      }


      const createdOrders = Array.isArray(data) ? data : data.result;
      if (createdOrders && createdOrders.length > 0) {
        setSaleSuccess(`Продажа ${conduct ? "создана и проведена" : "создана"} успешно!`);
        setCartItems([]);
        setClient(null);
        setPhone("");
        setComment("");
      } else {
        throw new Error('Созданные заказы не найдены в ответе');
      }
    } catch (error: any) {
      console.error('💥 Error:', error);
      setSaleError(error.message || "Произошла ошибка при создании продажи");
    } finally {
      setIsCreatingSale(false);
    }
  };



  return {
    token, setToken, isConnected,
    organizations, payboxes, warehouses, priceTypes,
    selectedOrg, setSelectedOrg, selectedPaybox, setSelectedPaybox,
    selectedWarehouse, setSelectedWarehouse, selectedPriceType, setSelectedPriceType,
    phone, setPhone, client, setClient, isSearchingClient, clientError,
    searchProduct, foundProducts, isSearchingProducts, cartItems, productSearchOpen, setProductSearchOpen,
    comment, setComment,
    loadingDictionaries, dictionariesError,
    isCreatingSale, saleError, setSaleError, saleSuccess, setSaleSuccess,
    totalSum,
    handleConnect, handleSearchClient, handleSearchProducts,
    addToCart, updateCartItemQuantity, updateCartItemPrice, removeCartItem,
    handleCreateSale,
  };
}