const API_BASE = '/api';

export const api = {
  async fetchOrganizations(token: string) {
    const res = await fetch(`${API_BASE}/organizations?token=${token}`);
    const data = await res.json();
    return data.result || [];
  },

  async fetchPayboxes(token: string) {
    const res = await fetch(`${API_BASE}/payboxes?token=${token}`);
    const data = await res.json();
    return data.result || [];
  },

  async fetchWarehouses(token: string) {
    const res = await fetch(`${API_BASE}/warehouses?token=${token}`);
    const data = await res.json();
    return data.result || [];
  },

  async fetchPriceTypes(token: string) {
    const res = await fetch(`${API_BASE}/price_types?token=${token}`);
    const data = await res.json();
    return data.result || [];
  },

  async searchClients(phone: string, token: string) {
    const res = await fetch(`${API_BASE}/contragents?phone=${encodeURIComponent(phone)}&token=${token}`);
    const data = await res.json();
    return data.result || [];
  },

  async searchProducts(query: string, token: string) {
    const res = await fetch(`${API_BASE}/nomenclature?search=${encodeURIComponent(query)}&token=${token}`);
    const data = await res.json();
    return data.result || [];
  },

  async createSale(payload: any, token: string) {
    const res = await fetch(`${API_BASE}/docs_sales?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || error.detail || 'Ошибка создания продажи');
    }
    return res.json();
  },
};
