import { createDB } from 'dexie';

// Define the database structure
interface TerraGuardianDBSchema {
  // Store user data offline
  user: {
    id: string;
    email: string;
    name?: string;
    points?: number;
    streak_days?: number;
    created_at: string;
  };
  
  // Store quests available offline
  quests: {
    id: string;
    type: 'soil_erosion' | 'crop_health' | 'water_monitoring' | 'vegetation_health' | 'degraded_land';
    title: string;
    description: string;
    points_reward: number;
    difficulty: 'easy' | 'medium' | 'hard';
    radius_km?: number;
    created_at: string;
    updated_at: string;
  };
  
  // Store submissions that need to be synced
  submissions: {
    id: string;
    questId: string;
    photoData: string; // Base64 encoded image
    location?: string;
    timestamp: number;
    synced: boolean;
    userId?: string;
  };
  
  // Store queued API requests for sync
  syncQueue: {
    id: string;
    action: string; // 'create', 'update', 'delete'
    entity: string; // 'submission', etc.
    data: any;
    createdAt: number;
    retryCount: number;
  };
}

// Create the database using Dexie
const db = new Dexie('TerraGuardianDB') as Dexie & {
  user: Table<TerraGuardianDBSchema['user'], string>;
  quests: Table<TerraGuardianDBSchema['quests'], string>;
  submissions: Table<TerraGuardianDBSchema['submissions'], string>;
  syncQueue: Table<TerraGuardianDBSchema['syncQueue'], string>;
};

// Initialize the database
db.version(1).stores({
  user: 'id',
  quests: 'id, type, difficulty',
  submissions: 'id, questId, synced, timestamp',
  syncQueue: 'id, entity, createdAt'
});

// Storage service with methods for offline functionality
class StorageService {
  // User operations
  async saveUser(user: TerraGuardianDBSchema['user']) {
    try {
      await db.user.put(user);
    } catch (error) {
      console.error('Error saving user to offline storage:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      const user = await db.user.toArray();
      return user[0] || null;
    } catch (error) {
      console.error('Error getting user from offline storage:', error);
      throw error;
    }
  }

  // Quest operations
  async saveQuests(quests: TerraGuardianDBSchema['quests'][]) {
    try {
      await db.quests.clear();
      await db.quests.bulkPut(quests);
    } catch (error) {
      console.error('Error saving quests to offline storage:', error);
      throw error;
    }
  }

  async getQuests(): Promise<TerraGuardianDBSchema['quests'][]> {
    try {
      return await db.quests.toArray();
    } catch (error) {
      console.error('Error getting quests from offline storage:', error);
      throw error;
    }
  }

  async getQuestById(id: string) {
    try {
      return await db.quests.get(id);
    } catch (error) {
      console.error('Error getting quest from offline storage:', error);
      throw error;
    }
  }

  // Submission operations
  async saveSubmission(submission: TerraGuardianDBSchema['submissions']) {
    try {
      await db.submissions.add(submission);
    } catch (error) {
      console.error('Error saving submission to offline storage:', error);
      throw error;
    }
  }

  async getUnsyncedSubmissions() {
    try {
      return await db.submissions.where('synced').equals(false).toArray();
    } catch (error) {
      console.error('Error getting unsynced submissions:', error);
      throw error;
    }
  }

  async markSubmissionAsSynced(id: string) {
    try {
      await db.submissions.update(id, { synced: true });
    } catch (error) {
      console.error('Error marking submission as synced:', error);
      throw error;
    }
  }

  // Sync queue operations
  async addToSyncQueue(item: Omit<TerraGuardianDBSchema['syncQueue'], 'id' | 'createdAt' | 'retryCount'>) {
    try {
      const queueItem: TerraGuardianDBSchema['syncQueue'] = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        retryCount: 0
      };
      await db.syncQueue.add(queueItem);
    } catch (error) {
      console.error('Error adding to sync queue:', error);
      throw error;
    }
  }

  async getSyncQueue() {
    try {
      return await db.syncQueue.toArray();
    } catch (error) {
      console.error('Error getting sync queue:', error);
      throw error;
    }
  }

  async removeFromSyncQueue(id: string) {
    try {
      await db.syncQueue.delete(id);
    } catch (error) {
      console.error('Error removing from sync queue:', error);
      throw error;
    }
  }

  async clear() {
    try {
      await db.user.clear();
      await db.quests.clear();
      await db.submissions.clear();
      await db.syncQueue.clear();
    } catch (error) {
      console.error('Error clearing offline storage:', error);
      throw error;
    }
  }

  // Initialize database with default data if needed
  async initialize() {
    try {
      // Check if we already have data
      const userCount = await db.user.count();
      if (userCount === 0) {
        // Initialize with empty database
        console.log('Initialized offline database');
      }
    } catch (error) {
      console.error('Error initializing offline database:', error);
      throw error;
    }
  }

  // Check if we're online and sync pending data
  async syncWithServer() {
    try {
      // Check if we're online
      if (!navigator.onLine) {
        console.log('Offline - skipping sync');
        return false;
      }

      // Get unsynced submissions
      const unsyncedSubmissions = await this.getUnsyncedSubmissions();
      
      // Sync each submission
      for (const submission of unsyncedSubmissions) {
        try {
          // In a real implementation, you would call your API here
          // For now, we'll just mark as synced after a delay to simulate network request
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mark as synced
          await this.markSubmissionAsSynced(submission.id);
          console.log(`Synced submission: ${submission.id}`);
        } catch (error) {
          console.error(`Failed to sync submission ${submission.id}:`, error);
          // In a real implementation, you might handle retries here
        }
      }

      // Sync queue items
      const queueItems = await this.getSyncQueue();
      for (const item of queueItems) {
        try {
          // In a real implementation, you would process each queued action
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.removeFromSyncQueue(item.id);
          console.log(`Processed sync queue item: ${item.id}`);
        } catch (error) {
          console.error(`Failed to process sync queue item ${item.id}:`, error);
          // Update retry count
          await db.syncQueue.update(item.id, { 
            retryCount: item.retryCount + 1 
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Error during sync:', error);
      throw error;
    }
  }
}

// Create and export the service instance
export const storageService = new StorageService();

// Initialize the service when imported
storageService.initialize().catch(error => {
  console.error('Failed to initialize offline storage:', error);
});

// Hook to use the storage service
export const useOfflineStorage = () => {
  return { storageService };
};