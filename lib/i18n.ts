import type { PropertyType, Status } from "@/types/house";

export const LANGUAGES = ["en", "pt"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "en";

type Dict = {
  appTagline: string;
  addHouse: string;
  addFirstHouse: string;
  editHouse: string;
  cancel: string;
  delete: string;
  edit: string;
  saving: string;
  saveChanges: string;
  createHouse: string;

  filterType: string;
  filterCity: string;
  filterParish: string;
  filterRooms: string;
  filterSort: string;
  allTypes: string;
  allCities: string;
  allParishes: string;
  anyRooms: string;
  all: string;

  sortPriceAsc: string;
  sortPriceDesc: string;
  sortSizeAsc: string;
  sortSizeDesc: string;

  fieldType: string;
  fieldAddress: string;
  fieldCity: string;
  fieldParish: string;
  fieldPrice: string;
  fieldSize: string;
  fieldRooms: string;
  fieldYear: string;
  fieldStatus: string;
  fieldListingUrl: string;
  fieldPhotoUrl: string;
  photoUrlHint: string;
  fieldRejectionReason: string;
  fieldNotes: string;

  placeholderAddress: string;
  placeholderCity: string;
  placeholderParish: string;
  placeholderYear: string;
  placeholderListingUrl: string;
  placeholderPhotoUrl: string;
  placeholderRejectionReason: string;
  placeholderNotes: string;

  noPhoto: string;
  rejectionLabel: string;

  emptyTitle: string;
  emptyBody: string;
  availableStatuses: string;
  noHousesInFilter: (filter: string) => React.ReactNode;

  deleteDialogTitle: string;
  deleteDialogBody: (type: string, city: string) => string;

  toastAdded: string;
  toastUpdated: string;
  toastDeleted: (type: string, city: string) => string;
  toastDeleteFailed: string;
  errorLoad: string;

  statusLabel: Record<Status, string>;
  typeLabel: Record<PropertyType, string>;
  languageLabel: Record<Language, string>;
};

const en: Dict = {
  appTagline: "Keep track of houses and apartments you're chasing.",
  addHouse: "Add house",
  addFirstHouse: "Add your first house",
  editHouse: "Edit house",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  saving: "Saving…",
  saveChanges: "Save changes",
  createHouse: "Create house",

  filterType: "Type",
  filterCity: "City",
  filterParish: "Parish",
  filterRooms: "Rooms",
  filterSort: "Sort",
  allTypes: "All types",
  allCities: "All cities",
  allParishes: "All parishes",
  anyRooms: "Any rooms",
  all: "All",

  sortPriceAsc: "Price (low → high)",
  sortPriceDesc: "Price (high → low)",
  sortSizeAsc: "Size (small → large)",
  sortSizeDesc: "Size (large → small)",

  fieldType: "Type",
  fieldAddress: "Address (optional)",
  fieldCity: "City",
  fieldParish: "Parish",
  fieldPrice: "Price (€)",
  fieldSize: "Size (m²)",
  fieldRooms: "Rooms",
  fieldYear: "Construction year",
  fieldStatus: "Status",
  fieldListingUrl: "Listing URL",
  fieldPhotoUrl: "Picture URL (optional)",
  photoUrlHint: "Leave empty to auto-generate a screenshot from the listing URL.",
  fieldRejectionReason: "Why was it rejected?",
  fieldNotes: "Notes",

  placeholderAddress: "Street, number",
  placeholderCity: "e.g. Lisboa",
  placeholderParish: "e.g. Parque das Nações",
  placeholderYear: "e.g. 1998",
  placeholderListingUrl: "https://www.idealista.pt/…",
  placeholderPhotoUrl: "https://…",
  placeholderRejectionReason: "e.g. Owner accepted a higher offer",
  placeholderNotes: "Anything worth remembering…",

  noPhoto: "No photo",
  rejectionLabel: "Why it was rejected:",

  emptyTitle: "No houses yet",
  emptyBody:
    "Track listings you're interested in, those you've contacted or visited, and the ones that fell through (along with why).",
  availableStatuses: "Available statuses:",
  noHousesInFilter: (f) => `No houses in ${f} yet.`,

  deleteDialogTitle: "Delete this house?",
  deleteDialogBody: (type, city) =>
    `This ${type.toLowerCase()} in ${city} will be permanently removed. This cannot be undone.`,

  toastAdded: "House added",
  toastUpdated: "House updated",
  toastDeleted: (type, city) => `Deleted ${type} in ${city}`,
  toastDeleteFailed: "Failed to delete",
  errorLoad: "Failed to load",

  statusLabel: {
    Interested: "Interested",
    Contacted: "Contacted",
    Visited: "Visited",
    Rejected: "Rejected",
  },
  typeLabel: {
    Apartment: "Apartment",
    House: "House",
  },
  languageLabel: {
    en: "EN",
    pt: "PT",
  },
};

const pt: Dict = {
  appTagline: "Acompanhe casas e apartamentos que está a procurar.",
  addHouse: "Adicionar imóvel",
  addFirstHouse: "Adicionar o primeiro imóvel",
  editHouse: "Editar imóvel",
  cancel: "Cancelar",
  delete: "Eliminar",
  edit: "Editar",
  saving: "A guardar…",
  saveChanges: "Guardar alterações",
  createHouse: "Criar imóvel",

  filterType: "Tipo",
  filterCity: "Cidade",
  filterParish: "Freguesia",
  filterRooms: "Tipologia",
  filterSort: "Ordenar",
  allTypes: "Todos os tipos",
  allCities: "Todas as cidades",
  allParishes: "Todas as freguesias",
  anyRooms: "Qualquer tipologia",
  all: "Todos",

  sortPriceAsc: "Preço (menor → maior)",
  sortPriceDesc: "Preço (maior → menor)",
  sortSizeAsc: "Área (menor → maior)",
  sortSizeDesc: "Área (maior → menor)",

  fieldType: "Tipo",
  fieldAddress: "Morada (opcional)",
  fieldCity: "Cidade",
  fieldParish: "Freguesia",
  fieldPrice: "Preço (€)",
  fieldSize: "Área (m²)",
  fieldRooms: "Tipologia",
  fieldYear: "Ano de construção",
  fieldStatus: "Estado",
  fieldListingUrl: "URL do anúncio",
  fieldPhotoUrl: "URL da imagem (opcional)",
  photoUrlHint:
    "Deixe vazio para gerar automaticamente uma captura do URL do anúncio.",
  fieldRejectionReason: "Porque foi rejeitado?",
  fieldNotes: "Notas",

  placeholderAddress: "Rua, número",
  placeholderCity: "ex. Lisboa",
  placeholderParish: "ex. Parque das Nações",
  placeholderYear: "ex. 1998",
  placeholderListingUrl: "https://www.idealista.pt/…",
  placeholderPhotoUrl: "https://…",
  placeholderRejectionReason: "ex. O proprietário aceitou uma proposta superior",
  placeholderNotes: "Qualquer coisa que vale a pena lembrar…",

  noPhoto: "Sem foto",
  rejectionLabel: "Razão da rejeição:",

  emptyTitle: "Ainda não tem imóveis",
  emptyBody:
    "Acompanhe anúncios em que está interessado, aqueles que contactou ou visitou, e os que não avançaram (e porquê).",
  availableStatuses: "Estados disponíveis:",
  noHousesInFilter: (f) => `Sem imóveis em ${f}.`,

  deleteDialogTitle: "Eliminar este imóvel?",
  deleteDialogBody: (type, city) =>
    `Este ${type.toLowerCase()} em ${city} será removido permanentemente. Esta ação não pode ser revertida.`,

  toastAdded: "Imóvel adicionado",
  toastUpdated: "Imóvel atualizado",
  toastDeleted: (type, city) => `Eliminado ${type} em ${city}`,
  toastDeleteFailed: "Falha ao eliminar",
  errorLoad: "Falha ao carregar",

  statusLabel: {
    Interested: "Interessado",
    Contacted: "Contactado",
    Visited: "Visitado",
    Rejected: "Rejeitado",
  },
  typeLabel: {
    Apartment: "Apartamento",
    House: "Moradia",
  },
  languageLabel: {
    en: "EN",
    pt: "PT",
  },
};

export const DICTIONARIES: Record<Language, Dict> = { en, pt };
export type { Dict };
