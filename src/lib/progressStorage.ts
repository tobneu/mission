import fs from 'fs';
import path from 'path';

const PROGRESS_FILE = path.join(process.cwd(), 'progress.json');

export function getSolvedTasks(): Set<number> {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
      return new Set(data.solvedTasks || []);
    }
  } catch (error) {
    console.error('Error reading progress file:', error);
  }
  return new Set<number>();
}

export function addSolvedTask(taskId: number): void {
  try {
    const solved = getSolvedTasks();
    solved.add(taskId);
    const data = { solvedTasks: Array.from(solved) };
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing progress file:', error);
  }
}

// --- Cooldown persistence helpers ---
type ProgressFileFormat = {
  solvedTasks?: number[];
  cooldowns?: Record<string, number>; // taskId -> timestamp (ms)
};

function readProgressData(): ProgressFileFormat {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const raw = fs.readFileSync(PROGRESS_FILE, 'utf8');
      return JSON.parse(raw) as ProgressFileFormat;
    }
  } catch (error) {
    console.error('Error reading progress file:', error);
  }
  return {};
}

function saveProgressData(data: ProgressFileFormat): void {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing progress file:', error);
  }
}

export function getCooldownForTask(taskId: number): number | null {
  try {
    const data = readProgressData();
    const cd = data.cooldowns?.[String(taskId)];
    return typeof cd === 'number' ? cd : null;
  } catch (error) {
    console.error('Error getting cooldown for task:', error);
    return null;
  }
}

export function setCooldownForTask(taskId: number, untilTimestampMs: number): void {
  try {
    const data = readProgressData();
    data.cooldowns = data.cooldowns || {};
    data.cooldowns[String(taskId)] = untilTimestampMs;
    saveProgressData(data);
  } catch (error) {
    console.error('Error setting cooldown for task:', error);
  }
}

export function clearCooldownForTask(taskId: number): void {
  try {
    const data = readProgressData();
    if (data.cooldowns && data.cooldowns[String(taskId)]) {
      delete data.cooldowns[String(taskId)];
      saveProgressData(data);
    }
  } catch (error) {
    console.error('Error clearing cooldown for task:', error);
  }
}

export function resetProgress(): void {
  try {
    // reset solved tasks and cooldowns
    const data: ProgressFileFormat = { solvedTasks: [], cooldowns: {} };
    saveProgressData(data);
  } catch (error) {
    console.error('Error resetting progress file:', error);
  }
}