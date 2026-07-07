import type { Country } from "./tax/types";

/**
 * Expense categories mapped to the lines the tax agency actually wants:
 * CRA form T2125 for Canada, IRS Schedule C for the US.
 */

export const EXPENSE_CATEGORIES: Record<Country, string[]> = {
  CA: [
    "Vehicle expenses",
    "Supplies",
    "Phone & utilities",
    "Meals & entertainment (50%)",
    "Advertising",
    "Office expenses",
    "Insurance",
    "Interest & bank charges",
    "Legal & professional fees",
    "Rent",
    "Repairs & maintenance",
    "Home office",
    "Other",
  ],
  US: [
    "Car & truck expenses",
    "Supplies",
    "Phone & utilities",
    "Meals (50%)",
    "Advertising",
    "Office expense",
    "Insurance",
    "Commissions & fees",
    "Legal & professional services",
    "Rent or lease",
    "Repairs & maintenance",
    "Home office",
    "Travel",
    "Other",
  ],
};

export const INCOME_SOURCES = [
  "Rideshare",
  "Delivery",
  "Freelance",
  "Contract work",
  "Trades / side jobs",
  "Marketplace sales",
  "Other",
];

export const TAX_FORM: Record<Country, string> = {
  CA: "T2125",
  US: "Schedule C",
};

export const TAX_AGENCY: Record<Country, string> = {
  CA: "CRA",
  US: "IRS",
};

export const CURRENCY: Record<Country, string> = {
  CA: "CAD",
  US: "USD",
};
