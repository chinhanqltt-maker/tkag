import { Facility, FilterState, TeamStats, OfficerStats, DuplicateGroup, IndustryRow } from '../types';

export const TEAM_LIST = [
  'Đội 2', 'Đội 3', 'Đội 4', 'Đội 5', 'Đội 6',
  'Đội 7', 'Đội 8', 'Đội 9', 'Đội 10', 'Đội 11', 'Đội 12'
];

export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function filterFacilities(facilities: Facility[], filter: FilterState): Facility[] {
  const searchLower = filter.search.trim().toLowerCase();
  const searchTokens = searchLower ? searchLower.split(/\s+/).filter(Boolean) : [];

  return facilities.filter(item => {
    // 1. Team filter
    if (filter.team !== 'ALL' && item.team !== filter.team) {
      return false;
    }

    // 2. Type filter
    if (filter.facilityType !== 'ALL' && item.facilityType !== filter.facilityType) {
      return false;
    }

    // 3. Industry filter
    if (filter.industry !== 'ALL') {
      const matchInd = item.industries.some(ind => ind.toLowerCase().includes(filter.industry.toLowerCase()));
      if (!matchInd) return false;
    }

    // 4. Ward / Administrative unit
    if (filter.ward !== 'ALL') {
      const w = (item.ward || '').toLowerCase();
      if (!w.includes(filter.ward.toLowerCase())) return false;
    }

    // 5. Survey week
    if (filter.surveyWeek !== 'ALL') {
      const wNum = parseInt(filter.surveyWeek, 10);
      if (item.surveyWeek !== wNum) return false;
    }

    // 6. Survey type (Mới / Lại)
    if (filter.surveyType !== 'ALL') {
      const st = (item.surveyType || '').toLowerCase();
      if (filter.surveyType === 'Mới' && !st.includes('mới')) return false;
      if (filter.surveyType === 'Lại' && !st.includes('lại')) return false;
    }

    // 7. Status
    if (filter.status !== 'ALL') {
      if (item.status !== filter.status) return false;
    }

    // 8. Officer
    if (filter.officer !== 'ALL') {
      const offArea = (item.officerArea || '').toLowerCase();
      const offInput = (item.officerInput || '').toLowerCase();
      const targetOff = filter.officer.toLowerCase();
      if (!offArea.includes(targetOff) && !offInput.includes(targetOff)) return false;
    }

    // 9. Smart Multi-token & Unaccented Search
    if (searchTokens.length > 0) {
      const rawText = [
        item.registeredName || '',
        item.signboardName || '',
        item.representative || '',
        item.mst || '',
        item.cccd || '',
        item.phone || '',
        item.fullAddress || '',
        item.ward || '',
        item.team || '',
        item.bLicenseNo || '',
        item.businessLines || '',
        item.officerArea || '',
        item.officerInput || '',
        (item.industries || []).join(' ')
      ].join(' ').toLowerCase();

      const normalizedText = removeVietnameseAccents(rawText);

      const allTokensMatch = searchTokens.every(token => {
        const tokenNormalized = removeVietnameseAccents(token);
        return rawText.includes(token) || normalizedText.includes(tokenNormalized);
      });

      if (!allTokensMatch) return false;
    }

    return true;
  });
}

export function calculateOverviewKPIs(facilities: Facility[]) {
  const total = facilities.length;
  let toChuc = 0;
  let caNhan = 0;
  let active = 0;
  let hasMST = 0;
  let hasCCCD = 0;
  let hasPhone = 0;

  const teamDistribution: Record<string, number> = {};
  const industryCounts: Record<string, number> = {};
  const wardCounts: Record<string, number> = {};

  TEAM_LIST.forEach(t => { teamDistribution[t] = 0; });

  for (let i = 0; i < total; i++) {
    const f = facilities[i];
    if (f.facilityType === 'Tổ chức') toChuc++;
    else caNhan++;

    if (f.status === 'Đang hoạt động' || !f.status) active++;
    if (f.mst) hasMST++;
    if (f.cccd) hasCCCD++;
    if (f.phone) hasPhone++;

    if (f.team) {
      teamDistribution[f.team] = (teamDistribution[f.team] || 0) + 1;
    }

    if (f.ward) {
      const cleanWard = f.ward.replace(/^(phường|xã|thị trấn)\s+/i, '').trim();
      if (cleanWard) wardCounts[cleanWard] = (wardCounts[cleanWard] || 0) + 1;
    }

    if (f.industries && f.industries.length > 0) {
      f.industries.forEach(ind => {
        const cleanInd = ind.replace(/^[0-9\.\s]+/, '').trim();
        industryCounts[cleanInd] = (industryCounts[cleanInd] || 0) + 1;
      });
    }
  }

  // Top 10 industries
  const topIndustries = Object.entries(industryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top 10 wards
  const topWards = Object.entries(wardCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Team comparison array
  const teamComparison = TEAM_LIST.map(teamName => ({
    team: teamName,
    count: teamDistribution[teamName] || 0
  }));

  return {
    total,
    toChuc,
    caNhan,
    active,
    inactive: total - active,
    hasMST,
    hasCCCD,
    hasPhone,
    teamComparison,
    topIndustries,
    topWards
  };
}

export function calculateTeamStats(facilities: Facility[]): TeamStats[] {
  const result: Record<string, TeamStats> = {};

  TEAM_LIST.forEach(t => {
    result[t] = {
      teamName: t,
      totalFacilities: 0,
      toChuc: 0,
      caNhan: 0,
      activeFacilities: 0,
      totalSurveys: 0,
      newSurveys: 0,
      reSurveys: 0,
      topIndustries: [],
      officers: []
    };
  });

  const indByTeam: Record<string, Record<string, number>> = {};
  const offByTeam: Record<string, Set<string>> = {};

  TEAM_LIST.forEach(t => {
    indByTeam[t] = {};
    offByTeam[t] = new Set();
  });

  facilities.forEach(f => {
    const t = f.team;
    if (!result[t]) return;

    result[t].totalFacilities++;
    if (f.facilityType === 'Tổ chức') result[t].toChuc++;
    else result[t].caNhan++;

    if (f.status === 'Đang hoạt động' || !f.status) result[t].activeFacilities++;

    if (f.surveyType) {
      result[t].totalSurveys++;
      if (f.surveyType.toLowerCase().includes('mới')) result[t].newSurveys++;
      if (f.surveyType.toLowerCase().includes('lại')) result[t].reSurveys++;
    }

    if (f.officerArea) {
      f.officerArea.split(/[\n,;]+/).forEach(name => {
        const clean = name.trim();
        if (clean) offByTeam[t].add(clean);
      });
    }

    f.industries.forEach(ind => {
      indByTeam[t][ind] = (indByTeam[t][ind] || 0) + 1;
    });
  });

  return TEAM_LIST.map(t => {
    const item = result[t];
    item.officers = Array.from(offByTeam[t]);
    item.topIndustries = Object.entries(indByTeam[t])
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    return item;
  });
}

export function calculateOfficerStats(facilities: Facility[]): OfficerStats[] {
  const map: Record<string, OfficerStats> = {};

  facilities.forEach(f => {
    // Officer Area
    if (f.officerArea) {
      f.officerArea.split(/[\n,;]+/).forEach(rawName => {
        const name = rawName.trim();
        if (!name) return;
        const key = `${name}_${f.team}`;
        if (!map[key]) {
          map[key] = {
            name,
            team: f.team,
            role: 'Quản lý địa bàn',
            facilityCount: 0,
            wards: [],
            surveyCount: 0
          };
        }
        map[key].facilityCount++;
        if (f.ward && !map[key].wards.includes(f.ward)) {
          map[key].wards.push(f.ward);
        }
        if (f.surveyType) map[key].surveyCount++;
      });
    }

    // Officer Input
    if (f.officerInput) {
      f.officerInput.split(/[\n,;]+/).forEach(rawName => {
        const name = rawName.trim();
        if (!name) return;
        const key = `${name}_${f.team}`;
        if (!map[key]) {
          map[key] = {
            name,
            team: f.team,
            role: 'Nhập liệu',
            facilityCount: 0,
            wards: [],
            surveyCount: 0
          };
        } else if (map[key].role === 'Quản lý địa bàn') {
          map[key].role = 'Cả hai';
        }
      });
    }
  });

  return Object.values(map).sort((a, b) => b.facilityCount - a.facilityCount);
}

export function findDuplicates(facilities: Facility[]): DuplicateGroup[] {
  const mstMap: Record<string, Facility[]> = {};
  const cccdMap: Record<string, Facility[]> = {};
  const phoneMap: Record<string, Facility[]> = {};

  facilities.forEach(f => {
    if (f.mst && f.mst.length > 5) {
      mstMap[f.mst] = mstMap[f.mst] || [];
      mstMap[f.mst].push(f);
    }
    if (f.cccd && f.cccd.length > 7) {
      cccdMap[f.cccd] = cccdMap[f.cccd] || [];
      cccdMap[f.cccd].push(f);
    }
    if (f.phone && f.phone.length >= 9) {
      const cleanPhone = f.phone.replace(/\D/g, '');
      if (cleanPhone.length >= 9) {
        phoneMap[cleanPhone] = phoneMap[cleanPhone] || [];
        phoneMap[cleanPhone].push(f);
      }
    }
  });

  const duplicates: DuplicateGroup[] = [];

  // Duplicates by MST
  Object.entries(mstMap).forEach(([mst, list]) => {
    if (list.length > 1) {
      duplicates.push({ type: 'MST', key: mst, facilities: list });
    }
  });

  // Duplicates by CCCD
  Object.entries(cccdMap).forEach(([cccd, list]) => {
    if (list.length > 1) {
      duplicates.push({ type: 'CCCD', key: cccd, facilities: list });
    }
  });

  // Duplicates by Phone
  Object.entries(phoneMap).forEach(([phone, list]) => {
    if (list.length > 1) {
      duplicates.push({ type: 'PHONE', key: phone, facilities: list });
    }
  });

  return duplicates;
}

export function getDistinctWards(facilities: Facility[]): string[] {
  const set = new Set<string>();
  facilities.forEach(f => {
    if (f.ward) set.add(f.ward.trim());
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
}

export function getDistinctOfficers(facilities: Facility[]): string[] {
  const set = new Set<string>();
  facilities.forEach(f => {
    if (f.officerArea) {
      f.officerArea.split(/[\n,;]+/).forEach(n => {
        const c = n.trim();
        if (c) set.add(c);
      });
    }
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
}
