import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Artifact, 
  CreateArtifactRequest, 
  UpdateArtifactRequest,
  ArtifactType,
  DifficultyLevel,
  PortfolioData,
  PortfolioSection
} from '@/types';

interface ArtifactsState {
  // State
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  uploadProgress: number;
  isUploading: boolean;
  searchQuery: string;
  selectedTags: string[];
  selectedType: ArtifactType | null;
  selectedPhase: string | null;
  
  // Actions
  setArtifacts: (artifacts: Artifact[]) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  deleteArtifact: (id: string) => void;
  setSelectedArtifact: (artifact: Artifact | null) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (isUploading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedType: (type: ArtifactType | null) => void;
  setSelectedPhase: (phaseId: string | null) => void;
  clearFilters: () => void;
  
  // Computed getters
  getFilteredArtifacts: () => Artifact[];
  getArtifactsByPhase: (phaseId: string) => Artifact[];
  getArtifactsByTask: (taskId: string) => Artifact[];
  getArtifactsByType: (type: ArtifactType) => Artifact[];
  getAllTags: () => string[];
  getPortfolioData: () => PortfolioData;
  getPortfolioSections: () => PortfolioSection[];
}

export const useArtifactsStore = create<ArtifactsState>()(
  persist(
    (set, get) => ({
      // Initial state
      artifacts: [],
      selectedArtifact: null,
      uploadProgress: 0,
      isUploading: false,
      searchQuery: '',
      selectedTags: [],
      selectedType: null,
      selectedPhase: null,

      // Actions
      setArtifacts: (artifacts) => set({ artifacts }),
      
      addArtifact: (artifact) => set((state) => ({
        artifacts: [...state.artifacts, artifact]
      })),
      
      updateArtifact: (id, updates) => set((state) => ({
        artifacts: state.artifacts.map(artifact =>
          artifact.id === id ? { ...artifact, ...updates, updatedAt: new Date() } : artifact
        )
      })),
      
      deleteArtifact: (id) => set((state) => ({
        artifacts: state.artifacts.filter(artifact => artifact.id !== id),
        selectedArtifact: state.selectedArtifact?.id === id ? null : state.selectedArtifact
      })),
      
      setSelectedArtifact: (artifact) => set({ selectedArtifact: artifact }),
      
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      
      setIsUploading: (isUploading) => set({ isUploading }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      
      setSelectedType: (type) => set({ selectedType: type }),
      
      setSelectedPhase: (phaseId) => set({ selectedPhase: phaseId }),
      
      clearFilters: () => set({
        searchQuery: '',
        selectedTags: [],
        selectedType: null,
        selectedPhase: null
      }),

      // Computed getters
      getFilteredArtifacts: () => {
        const { artifacts, searchQuery, selectedTags, selectedType, selectedPhase } = get();
        
        return artifacts.filter(artifact => {
          // Search query filter
          if (searchQuery && !artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !artifact.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          // Tags filter
          if (selectedTags.length > 0 && !selectedTags.some(tag => artifact.tags.includes(tag))) {
            return false;
          }
          
          // Type filter
          if (selectedType && artifact.type !== selectedType) {
            return false;
          }
          
          // Phase filter
          if (selectedPhase && artifact.phaseId !== selectedPhase) {
            return false;
          }
          
          return true;
        });
      },
      
      getArtifactsByPhase: (phaseId) => {
        const { artifacts } = get();
        return artifacts.filter(artifact => artifact.phaseId === phaseId);
      },
      
      getArtifactsByTask: (taskId) => {
        const { artifacts } = get();
        return artifacts.filter(artifact => artifact.taskId === taskId);
      },
      
      getArtifactsByType: (type) => {
        const { artifacts } = get();
        return artifacts.filter(artifact => artifact.type === type);
      },
      
      getAllTags: () => {
        const { artifacts } = get();
        const allTags = artifacts.flatMap(artifact => artifact.tags);
        return Array.from(new Set(allTags)).sort();
      },
      
      getPortfolioData: () => {
        const { artifacts } = get();
        const publicArtifacts = artifacts.filter(artifact => artifact.isPublic);
        
        // フェーズごとの成果物数を計算
        const phaseArtifacts = publicArtifacts.reduce((acc, artifact) => {
          acc[artifact.phaseId] = (acc[artifact.phaseId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // スキルを抽出（タグとメタデータから）
        const skillsSet = new Set<string>();
        publicArtifacts.forEach(artifact => {
          artifact.tags.forEach(tag => skillsSet.add(tag));
          if (artifact.metadata.language) skillsSet.add(artifact.metadata.language);
          if (artifact.metadata.framework) skillsSet.add(artifact.metadata.framework);
        });
        
        return {
          artifacts: publicArtifacts,
          phases: [], // これは別のストアから取得する必要がある
          totalProjects: publicArtifacts.filter(a => a.type === 'code').length,
          skillsAcquired: Array.from(skillsSet),
          completionRate: 0 // これも別のストアから計算する必要がある
        };
      },
      
      getPortfolioSections: () => {
        const { artifacts } = get();
        const publicArtifacts = artifacts.filter(artifact => artifact.isPublic);
        
        // フェーズごとにグループ化
        const phaseGroups = publicArtifacts.reduce((acc, artifact) => {
          if (!acc[artifact.phaseId]) {
            acc[artifact.phaseId] = [];
          }
          acc[artifact.phaseId].push(artifact);
          return acc;
        }, {} as Record<string, Artifact[]>);
        
        return Object.entries(phaseGroups).map(([phaseId, artifacts]) => ({
          id: phaseId,
          title: `Phase ${phaseId}`, // 実際のフェーズ名は別のストアから取得
          description: `${artifacts.length}個の成果物`,
          artifacts,
          phase: {} as any // 実際のフェーズデータは別のストアから取得
        }));
      }
    }),
    {
      name: 'artifacts-store',
      partialize: (state) => ({
        artifacts: state.artifacts,
        searchQuery: state.searchQuery,
        selectedTags: state.selectedTags,
        selectedType: state.selectedType,
        selectedPhase: state.selectedPhase
      })
    }
  )
);