export interface Facility {
  id: number;
  stt: number | string;
  facilityType: 'Tổ chức' | 'Cá nhân';
  rawType: string;
  signboardName: string;
  registeredName: string;
  representative: string;
  position: string;
  birthDate: string;
  cccd: string;
  cccdDate: string;
  cccdPlace: string;
  phone: string;
  businessLines: string;
  mst: string;
  bLicenseNo: string;
  bLicenseBranch: string;
  bLicenseLoc: string;
  bLicenseDate: string;
  bLicensePlace: string;
  condCertNo: string;
  condCertDate: string;
  condCertPlace: string;
  condCertExp: string;
  pracLicenseNo: string;
  pracLicenseDate: string;
  pracLicensePlace: string;
  pracLicenseExp: string;
  otherLicenseName: string;
  otherLicenseNo: string;
  otherLicenseDate: string;
  otherLicensePlace: string;
  otherLicenseExp: string;
  fullAddress: string;
  streetNo: string;
  hamlet: string;
  ward: string;
  surveyWeek: number | null;
  surveyType: string; // "Mới", "Lại", etc.
  officerArea: string;
  officerInput: string;
  industries: string[];
  note: string;
  status: string;
  team: string; // "Đội 2" -> "Đội 12"
}

export interface IndustryRow {
  row: number;
  code: string;
  name: string;
  isCategoryHeader: boolean;
  teams: Record<string, number>;
  total: number;
}

export interface WeeklyRow {
  weekLabel: string;
  weekNum: number;
  total: {
    byTeam: Record<string, number>;
    all: number;
  };
  newSurvey: {
    byTeam: Record<string, number>;
    all: number;
  };
  reSurvey: {
    byTeam: Record<string, number>;
    all: number;
  };
}

export interface TeamStats {
  teamName: string;
  totalFacilities: number;
  toChuc: number;
  caNhan: number;
  activeFacilities: number;
  totalSurveys: number;
  newSurveys: number;
  reSurveys: number;
  topIndustries: { name: string; count: number }[];
  officers: string[];
}

export interface OfficerStats {
  name: string;
  team: string;
  role: 'Quản lý địa bàn' | 'Nhập liệu' | 'Cả hai';
  facilityCount: number;
  wards: string[];
  surveyCount: number;
}

export interface FilterState {
  search: string;
  team: string; // 'ALL' or 'Đội 2', ...
  facilityType: string; // 'ALL', 'Tổ chức', 'Cá nhân'
  industry: string; // 'ALL' or specific industry
  ward: string; // 'ALL' or specific ward
  surveyWeek: string; // 'ALL' or week number
  surveyType: string; // 'ALL', 'Mới', 'Lại'
  status: string; // 'ALL', 'Đang hoạt động', etc.
  officer: string; // 'ALL' or specific officer
}

export interface DuplicateGroup {
  type: 'MST' | 'CCCD' | 'PHONE' | 'NAME_ADDRESS';
  key: string;
  facilities: Facility[];
}
