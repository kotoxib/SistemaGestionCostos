import { DefendantCatalogEntry, DefendantRow, IncomeTemplateOption } from './defendant.models';

export const DEFENDANT_CLIENTS: string[] = [
  'BCP S.A.',
  'BBVA Perú',
  'Banco Pichincha',
  'Banco de Crédito',
  'Interbank',
  'Scotiabank',
];

export const DEFENDANT_CATALOG_BY_CLIENT: Record<string, DefendantCatalogEntry[]> = {
  'BCP S.A.': [
    { fullName: 'Rodríguez Fuentes María Elena', documentType: 'DNI', documentNumber: '42816304', legalRole: 'Demandado' },
    { fullName: 'Gómez Paredes Roberto Luis', documentType: 'DNI', documentNumber: '30584219', legalRole: 'Co-demandado' },
    { fullName: 'Inversiones Alpha SAC', documentType: 'RUC', documentNumber: '20548321076', legalRole: 'Garante' },
  ],
  'BBVA Perú': [
    { fullName: 'Torres Quispe Carlos Alberto', documentType: 'DNI', documentNumber: '20163948', legalRole: 'Demandado' },
    { fullName: 'Villanueva Mora Ana Sofía', documentType: 'DNI', documentNumber: '35920184', legalRole: 'Co-demandado' },
  ],
  'Banco Pichincha': [
    { fullName: 'Flores Medina Jorge Humberto', documentType: 'DNI', documentNumber: '41827356', legalRole: 'Demandado' },
    { fullName: 'Constructora JFM EIRL', documentType: 'RUC', documentNumber: '20482951083', legalRole: 'Garante' },
  ],
  'Banco de Crédito': [
    { fullName: 'Sánchez Lupaca Rosa Beatriz', documentType: 'DNI', documentNumber: '28394710', legalRole: 'Demandado' },
  ],
  Interbank: [
    { fullName: 'Medina Castro Paul Roberto', documentType: 'DNI', documentNumber: '47382946', legalRole: 'Demandado' },
    { fullName: 'Empresa Transmar Perú SA', documentType: 'RUC', documentNumber: '20517283946', legalRole: 'Garante' },
  ],
  Scotiabank: [{ fullName: 'Ramírez Soto Alberto César', documentType: 'DNI', documentNumber: '33847162', legalRole: 'Demandado' }],
};

export const INCOME_TEMPLATES: IncomeTemplateOption[] = [
  { clientName: 'BCP S.A.', fileName: 'PLANTILLA_REEMBOLSO_BCP.xlsx', type: 'Reembolso' },
  { clientName: 'BCP S.A.', fileName: 'CUADRO_LIQUIDACION_BCP.xlsx', type: 'Archivo - Cuadro' },
  { clientName: 'BBVA Perú', fileName: 'PLANTILLA_REEMBOLSO_BBVA.xlsx', type: 'Reembolso' },
  { clientName: 'BBVA Perú', fileName: 'MODELO_ARCHIVO_BBVA.xlsx', type: 'Archivo - Cuadro' },
  { clientName: 'Interbank', fileName: 'PLANTILLA_REEMBOLSO_IBK.xlsx', type: 'Reembolso' },
  { clientName: 'Scotiabank', fileName: 'PLANTILLA_REEMBOLSO_SCOT.xlsx', type: 'Reembolso' },
  { clientName: 'Banco Pichincha', fileName: 'PLANTILLA_REEMBOLSO_PICH.xlsx', type: 'Reembolso' },
  { clientName: 'Banco de Crédito', fileName: 'CUADRO_FINANCIERO_BDC.xlsx', type: 'Archivo - Cuadro' },
];

export const DEFENDANT_SAMPLE_DATA: DefendantRow[] = [
  {
    id: 1,
    clientName: 'BCP S.A.',
    documentType: 'DNI',
    documentNumber: '42816304',
    fullName: 'Rodríguez Fuentes María Elena',
    legalRole: 'Demandado',
    phone: '987654321',
    address: 'Av. Los Álamos 234, Lima',
    email: 'mrodriguez@gmail.com',
    refundTemplate: 'PLANTILLA_REEMBOLSO_BCP.xlsx',
    fileModel: 'CUADRO_LIQUIDACION_BCP.xlsx',
    state: 'Activo',
  },
  {
    id: 2,
    clientName: 'BCP S.A.',
    documentType: 'DNI',
    documentNumber: '30584219',
    fullName: 'Gómez Paredes Roberto Luis',
    legalRole: 'Co-demandado',
    phone: '',
    address: '',
    email: '',
    refundTemplate: 'PLANTILLA_REEMBOLSO_BCP.xlsx',
    fileModel: '',
    state: 'Activo',
  },
  {
    id: 3,
    clientName: 'BBVA Perú',
    documentType: 'DNI',
    documentNumber: '20163948',
    fullName: 'Torres Quispe Carlos Alberto',
    legalRole: 'Demandado',
    phone: '912345678',
    address: 'Jr. Las Palmeras 456, Miraflores',
    email: 'ctorres@hotmail.com',
    refundTemplate: 'PLANTILLA_REEMBOLSO_BBVA.xlsx',
    fileModel: 'MODELO_ARCHIVO_BBVA.xlsx',
    state: 'Activo',
  },
  {
    id: 4,
    clientName: 'Interbank',
    documentType: 'DNI',
    documentNumber: '47382946',
    fullName: 'Medina Castro Paul Roberto',
    legalRole: 'Demandado',
    phone: '',
    address: 'Calle Bolognesi 890, San Isidro',
    email: 'pmedina@empresa.pe',
    refundTemplate: 'PLANTILLA_REEMBOLSO_IBK.xlsx',
    fileModel: '',
    state: 'Activo',
  },
  {
    id: 5,
    clientName: 'Scotiabank',
    documentType: 'DNI',
    documentNumber: '33847162',
    fullName: 'Ramírez Soto Alberto César',
    legalRole: 'Demandado',
    phone: '956781234',
    address: 'Av. Reducto 1120, Miraflores',
    email: 'aramirez@outlook.com',
    refundTemplate: 'PLANTILLA_REEMBOLSO_SCOT.xlsx',
    fileModel: '',
    state: 'Inactivo',
  },
];
