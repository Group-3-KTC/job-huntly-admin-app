import { type Company, mockCompany } from "../mock/mockCompany";

export const companyService = {
  getAll: (): Promise<Company[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCompany), 500);
    });
  },

  getById: (id: number): Promise<Company | undefined> => {
    return new Promise((resolve) => {
      const result = mockCompany.find((c) => c.id === id);
      setTimeout(() => resolve(result), 300);
    });
  },

  add: (company: Company): Promise<Company> => {
    return new Promise((resolve) => {
      const newCompany = { ...company, id: Date.now() };
      mockCompany.push(newCompany);
      setTimeout(() => resolve(newCompany), 300);
    });
  },

  update: (id: number, patch: Partial<Company>): Promise<Company | null> => {
    return new Promise((resolve) => {
      const index = mockCompany.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockCompany[index] = { ...mockCompany[index], ...patch };
        setTimeout(() => resolve(mockCompany[index]), 300);
      } else {
        resolve(null);
      }
    });
  },

  delete: (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const index = mockCompany.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockCompany.splice(index, 1);
        setTimeout(() => resolve(true), 200);
      } else {
        resolve(false);
      }
    });
  },
};
