export interface CustomerProfileData {
  companyFullName: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  corporateEmail: string;
  whatsapp: string;
  address?: string;
  website?: string;
  phone?: string;
}

export interface SupplierProfileData {
  companyFullName: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  corporateEmail: string;
  whatsapp: string;
  address?: string;
  website?: string;
  contactName?: string;
  phone?: string;
}

export interface SectorProfessionalProfileData {
  fullName: string;
  tradeName: string;
  cpf: string;
  corporateEmail: string;
  whatsapp: string;
  address?: string;
  website?: string;
  contactName?: string;
  phone?: string;
}

export type ProfileData =
  | CustomerProfileData
  | SupplierProfileData
  | SectorProfessionalProfileData
  | Record<string, any>;
