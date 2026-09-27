import type { DashboardState } from '../types';
import { initialDashboardState } from '../data/initialData';
import { getSupabase } from './supabase';

const STORAGE_KEY = 'anik_nexus_dashboard_v1';

export const loadState = (): DashboardState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialDashboardState;
    }
    const parsed = JSON.parse(raw) as Partial<DashboardState>;
    return {
      ...initialDashboardState,
      ...parsed,
      profile: { ...initialDashboardState.profile, ...parsed.profile },
      courses: parsed.courses || initialDashboardState.courses,
      todos: parsed.todos || initialDashboardState.todos,
      habits: parsed.habits || initialDashboardState.habits,
      assignments: parsed.assignments || initialDashboardState.assignments,
      quotes: parsed.quotes || initialDashboardState.quotes,
      books: parsed.books || initialDashboardState.books,
      cloudConfig: { ...initialDashboardState.cloudConfig, ...parsed.cloudConfig },
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return initialDashboardState;
  }
};

export const saveState = (state: DashboardState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

export const exportStateJson = (state: DashboardState): string => {
  return JSON.stringify(state, null, 2);
};

export const downloadBackupFile = (state: DashboardState) => {
  const jsonStr = exportStateJson(state);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `anik_dashboard_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importStateFromJson = (jsonStr: string): DashboardState => {
  const parsed = JSON.parse(jsonStr) as DashboardState;
  if (!parsed.profile || !parsed.courses || !parsed.todos) {
    throw new Error('Invalid dashboard backup file format.');
  }
  return parsed;
};

export const syncToCloud = async (state: DashboardState): Promise<{ success: boolean; message: string }> => {
  const client = getSupabase();
  if (!client) {
    return { success: false, message: 'Supabase credentials not configured.' };
  }

  try {
    const { error } = await client
      .from('user_dashboard')
      .upsert({
        id: 'anik_primary_dashboard',
        user_name: state.profile.name || 'Nh Anik',
        data: state,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase sync error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully synced to Cloud Database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Unknown network error during cloud sync.' };
  }
};

export const fetchFromCloud = async (): Promise<{ success: boolean; data?: DashboardState; message: string }> => {
  const client = getSupabase();
  if (!client) {
    return { success: false, message: 'Supabase credentials not configured.' };
  }

  try {
    const { data, error } = await client
      .from('user_dashboard')
      .select('data, updated_at')
      .eq('id', 'anik_primary_dashboard')
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    if (data && data.data) {
      return { success: true, data: data.data as DashboardState, message: 'Retrieved cloud backup successfully.' };
    }

    return { success: false, message: 'No remote backup found in Supabase table.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error fetching from cloud.' };
  }
};
