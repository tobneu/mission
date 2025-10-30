import fs from 'fs';
import path from 'path';

const PROGRESS_FILE = path.join(process.cwd(), 'progress.json');

export function getSolvedStations(): Set<number> {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
      return new Set(data.solvedStations || []);
    }
  } catch (error) {
    console.error('Error reading progress file:', error);
  }
  return new Set<number>();
}

export function addSolvedStation(stationId: number): void {
  try {
    const solved = getSolvedStations();
    solved.add(stationId);
    const data = { solvedStations: Array.from(solved) };
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing progress file:', error);
  }
}