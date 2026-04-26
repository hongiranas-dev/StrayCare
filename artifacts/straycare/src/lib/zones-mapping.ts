import { zoneData, type Zone } from "@/data/zones";

const HIGH_PRIORITY_DENSITY_THRESHOLD = 500;
const HIGH_PRIORITY_NEUTERED_THRESHOLD = 70;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getZoneForLocation(location: string): Zone | null {
  if (!location) return null;
  const lowerLoc = location.toLowerCase();
  
  let bestMatch: Zone | null = null;
  let maxMatchLength = 0;
  
  for (const zone of zoneData) {
    const nameMatch = zone.name.toLowerCase();
    const idMatch = zone.id.replace(/-/g, " ").toLowerCase();
    
    const nameRegex = new RegExp(`\\b${escapeRegExp(nameMatch)}\\b`, 'i');
    const idRegex = new RegExp(`\\b${escapeRegExp(idMatch)}\\b`, 'i');
    
    if (nameRegex.test(lowerLoc) || idRegex.test(lowerLoc)) {
      const matchLength = Math.max(nameMatch.length, idMatch.length);
      if (matchLength > maxMatchLength) {
        bestMatch = zone;
        maxMatchLength = matchLength;
      }
    }
  }
  
  return bestMatch;
}

export function isHighPriorityZone(zone: Zone): boolean {
  return zone.density > HIGH_PRIORITY_DENSITY_THRESHOLD && zone.neuteredPercentage < HIGH_PRIORITY_NEUTERED_THRESHOLD;
}

export function getReportPriority(location: string): boolean {
  const zone = getZoneForLocation(location);
  if (!zone) return false;
  return isHighPriorityZone(zone);
}
