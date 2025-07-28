import { z } from 'zod';

// Trade validation schema
export const tradeSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol must be 10 characters or less')
    .regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only'),
  trade_type: z.enum(['LONG', 'SHORT'], {
    required_error: 'Trade type is required'
  }),
  entry_price: z.number()
    .positive('Entry price must be positive')
    .max(1000000, 'Entry price is too high'),
  exit_price: z.number()
    .positive('Exit price must be positive')
    .max(1000000, 'Exit price is too high')
    .optional(),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be positive')
    .max(1000000, 'Quantity is too high'),
  entry_date: z.string()
    .min(1, 'Entry date is required'),
  exit_date: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).optional(),
  stop_loss: z.number()
    .positive('Stop loss must be positive')
    .max(1000000, 'Stop loss is too high')
    .optional(),
  take_profit: z.number()
    .positive('Take profit must be positive')
    .max(1000000, 'Take profit is too high')
    .optional(),
  setup_type: z.string()
    .max(50, 'Setup type must be 50 characters or less')
    .optional(),
  entry_reason: z.string()
    .max(500, 'Entry reason must be 500 characters or less')
    .optional(),
  exit_reason: z.string()
    .max(500, 'Exit reason must be 500 characters or less')
    .optional(),
});

// User settings validation schema
export const userSettingsSchema = z.object({
  account_capital: z.number()
    .positive('Account capital must be positive')
    .max(1000000000, 'Account capital is too high'),
  default_risk_percentage: z.number()
    .min(0.1, 'Risk percentage must be at least 0.1%')
    .max(100, 'Risk percentage cannot exceed 100%')
    .optional(),
  default_currency: z.string()
    .min(2, 'Currency code must be at least 2 characters')
    .max(10, 'Currency code must be 10 characters or less')
    .optional(),
});

// Calculator input validation schemas
export const compoundInterestSchema = z.object({
  initialAmount: z.number()
    .positive('Initial amount must be positive')
    .max(1000000000, 'Initial amount is too high'),
  monthlyContribution: z.number()
    .min(0, 'Monthly contribution cannot be negative')
    .max(1000000, 'Monthly contribution is too high'),
  annualRate: z.number()
    .min(0.1, 'Annual rate must be at least 0.1%')
    .max(100, 'Annual rate cannot exceed 100%'),
  years: z.number()
    .int('Years must be a whole number')
    .min(1, 'Time period must be at least 1 year')
    .max(100, 'Time period cannot exceed 100 years'),
});

export const loanEMISchema = z.object({
  principal: z.number()
    .positive('Principal amount must be positive')
    .max(1000000000, 'Principal amount is too high'),
  interestRate: z.number()
    .min(0.1, 'Interest rate must be at least 0.1%')
    .max(100, 'Interest rate cannot exceed 100%'),
  tenure: z.number()
    .int('Tenure must be a whole number')
    .min(1, 'Tenure must be at least 1 month')
    .max(600, 'Tenure cannot exceed 50 years'),
});

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Simple field validation helpers
export const validateSymbol = (value: string): string | null => {
  if (!value) return 'Symbol is required';
  if (value.length > 10) return 'Symbol must be 10 characters or less';
  if (!/^[A-Z]+$/.test(value)) return 'Symbol must be uppercase letters only';
  return null;
};

export const validatePrice = (value: number): string | null => {
  if (value <= 0) return 'Price must be positive';
  if (value > 1000000) return 'Price is too high';
  return null;
};

export const validateQuantity = (value: number): string | null => {
  if (!Number.isInteger(value)) return 'Quantity must be a whole number';
  if (value <= 0) return 'Quantity must be positive';
  if (value > 1000000) return 'Quantity is too high';
  return null;
}; 