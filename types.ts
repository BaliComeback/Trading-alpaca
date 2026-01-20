
export interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
  filename: string;
  code: (config: AlpacaConfig) => string;
}

export interface AlpacaConfig {
  apiKey: string;
  secretKey: string;
  isPaper: boolean;
}

export interface AlpacaAccount {
  status: string;
  currency: string;
  equity: string;
  last_equity: string;
  cash: string;
  buying_power: string;
  account_number: string;
}

export interface AlpacaPosition {
  symbol: string;
  qty: string;
  avg_entry_price: string;
  current_price: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  market_value: string;
}

export interface AlpacaOrder {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string | null;
  expired_at: string | null;
  canceled_at: string | null;
  failed_at: string | null;
  replaced_at: string | null;
  replaced_by: string | null;
  replaces: string | null;
  asset_id: string;
  symbol: string;
  asset_class: string;
  notional: string | null;
  qty: string | null;
  filled_qty: string;
  filled_avg_price: string | null;
  order_class: string;
  order_type: string;
  type: string;
  side: string;
  time_in_force: string;
  limit_price: string | null;
  stop_price: string | null;
  status: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export enum AppTab {
  GUIDE = 'guide',
  MENTOR = 'mentor',
  RESOURCES = 'resources'
}

export interface AiAnalysis {
  safety_score: number;
  recommendation: 'BUY' | 'WAIT' | 'SELL';
  reason: string;
}
