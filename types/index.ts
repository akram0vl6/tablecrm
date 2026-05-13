export interface CartItem {
    nomenclature_id: number;
    name: string;
    price: number;
    quantity: number;
  }
  
  export interface Organization {
    id: number;
    short_name?: string;
    full_name?: string;
    work_name?: string;
    name?: string;
  }
  
  export interface Paybox {
    id: number;
    name: string;
    paybox_number?: string;
  }
  
  export interface Warehouse {
    id: number;
    name: string;
  }
  
  export interface PriceType {
    id: number;
    name: string;
  }
  
  export interface Client {
    id: number;
    name?: string;
    phone?: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    price?: number;
  }

  export interface TokenAuthProps {
    token: string;
    setToken: (v: string) => void;
    isConnected: boolean;
    onConnect: () => void;
  }

  export interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
    duration?: number;
  }

  export interface SaleParamsProps {
    isConnected: boolean;
    organizations: any[];
    payboxes: any[];
    warehouses: any[];
    priceTypes: any[];
    selectedOrg: string;
    setSelectedOrg: (v: string) => void;
    selectedPaybox: string;
    setSelectedPaybox: (v: string) => void;
    selectedWarehouse: string;
    setSelectedWarehouse: (v: string) => void;
    selectedPriceType: string;
    setSelectedPriceType: (v: string) => void;
  }

  export interface SaleActionsProps {
    isConnected: boolean;
    cartEmpty: boolean;
    isCreating: boolean;
    onCreateSale: () => void;
    onCreateAndConduct: () => void;
  }

  export interface ProductSearchProps {
    isConnected: boolean;
    searchProduct: string;
    onSearch: (query: string) => void;
    isSearching: boolean;
    foundProducts: any[];
    productSearchOpen: boolean;
    onToggleSearch: (open: boolean) => void;
    onAddToCart: (product: any) => void;
  }

  export interface CommentSectionProps {
    comment: string;
    setComment: (v: string) => void;
    isConnected: boolean;
  }


  export interface ClientSearchProps {
    phone: string;
    setPhone: (v: string) => void;
    isConnected: boolean;
    onSearch: () => void;
    isSearching: boolean;
    client: any;
    clientError: string;
    onClearClient: () => void;
  }


  export interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: number, delta: number) => void;
    onUpdatePrice: (id: number, price: number) => void;
    onRemoveItem: (id: number) => void;
    totalSum: number;
  }
  