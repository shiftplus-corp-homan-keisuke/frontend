import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useArtifactsStore } from '@/stores/artifacts-store';
import { 
  getArtifacts, 
  getArtifact, 
  createArtifact, 
  updateArtifact, 
  deleteArtifact,
  uploadFile,
  getPopularTags,
  getArtifactStats
} from '@/lib/api/artifacts';
import type { 
  Artifact, 
  CreateArtifactRequest, 
  UpdateArtifactRequest,
  GetArtifactsQuery,
  ArtifactMetadata
} from '@/types';

interface UseArtifactsOptions {
  userId?: string;
  phaseId?: string;
  taskId?: string;
  enabled?: boolean;
}

interface UseArtifactsReturn {
  artifacts: Artifact[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export function useArtifacts(options: UseArtifactsOptions = {}): UseArtifactsReturn {
  const { userId, phaseId, taskId, enabled = true } = options;
  
  const query: GetArtifactsQuery = {
    ...(userId && { userId }),
    ...(phaseId && { phaseId }),
    ...(taskId && { taskId }),
    limit: 20
  };

  const {
    data,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useQuery({
    queryKey: ['artifacts', query],
    queryFn: () => getArtifacts(query),
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });

  return {
    artifacts: data?.data || [],
    isLoading,
    error: error as Error | null,
    refetch,
    hasNextPage: data?.hasMore || false,
    fetchNextPage,
    isFetchingNextPage
  };
}

interface UseArtifactOptions {
  artifactId: string;
  enabled?: boolean;
}

interface UseArtifactReturn {
  artifact: Artifact | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useArtifact(options: UseArtifactOptions): UseArtifactReturn {
  const { artifactId, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['artifact', artifactId],
    queryFn: () => getArtifact(artifactId),
    enabled: enabled && !!artifactId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    artifact: data?.data || null,
    isLoading,
    error: error as Error | null,
    refetch
  };
}

interface UseArtifactMutationsReturn {
  createArtifact: (data: CreateArtifactRequest) => Promise<Artifact>;
  updateArtifact: (id: string, data: UpdateArtifactRequest) => Promise<Artifact>;
  deleteArtifact: (id: string) => Promise<void>;
  uploadFile: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isUploading: boolean;
}

export function useArtifactMutations(): UseArtifactMutationsReturn {
  const queryClient = useQueryClient();
  const { addArtifact, updateArtifact: updateArtifactInStore, deleteArtifact: deleteArtifactFromStore, setIsUploading, setUploadProgress } = useArtifactsStore();

  const createMutation = useMutation({
    mutationFn: createArtifact,
    onSuccess: (response) => {
      addArtifact(response.data);
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArtifactRequest }) =>
      updateArtifact(id, data),
    onSuccess: (response, { id }) => {
      updateArtifactInStore(id, response.data);
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      queryClient.invalidateQueries({ queryKey: ['artifact', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArtifact,
    onSuccess: (_, id) => {
      deleteArtifactFromStore(id);
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      queryClient.removeQueries({ queryKey: ['artifact', id] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) => {
      setIsUploading(true);
      return uploadFile(file, (progress) => {
        setUploadProgress(progress);
        onProgress?.(progress);
      });
    },
    onSettled: () => {
      setIsUploading(false);
      setUploadProgress(0);
    },
  });

  return {
    createArtifact: useCallback(
      (data: CreateArtifactRequest) => createMutation.mutateAsync(data),
      [createMutation]
    ),
    updateArtifact: useCallback(
      (id: string, data: UpdateArtifactRequest) =>
        updateMutation.mutateAsync({ id, data }),
      [updateMutation]
    ),
    deleteArtifact: useCallback(
      (id: string) => deleteMutation.mutateAsync(id),
      [deleteMutation]
    ),
    uploadFile: useCallback(
      (file: File, onProgress?: (progress: number) => void) =>
        uploadMutation.mutateAsync({ file, onProgress }),
      [uploadMutation]
    ),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadMutation.isPending,
  };
}

interface UsePopularTagsReturn {
  tags: string[];
  isLoading: boolean;
  error: Error | null;
}

export function usePopularTags(): UsePopularTagsReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: getPopularTags,
    staleTime: 30 * 60 * 1000, // 30分間キャッシュ
  });

  return {
    tags: data || [],
    isLoading,
    error: error as Error | null
  };
}

interface UseArtifactStatsOptions {
  userId: string;
  enabled?: boolean;
}

interface UseArtifactStatsReturn {
  stats: {
    totalArtifacts: number;
    artifactsByType: Record<string, number>;
    artifactsByPhase: Record<string, number>;
    recentArtifacts: Artifact[];
  } | null;
  isLoading: boolean;
  error: Error | null;
}

export function useArtifactStats(options: UseArtifactStatsOptions): UseArtifactStatsReturn {
  const { userId, enabled = true } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['artifact-stats', userId],
    queryFn: () => getArtifactStats(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
  });

  return {
    stats: data || null,
    isLoading,
    error: error as Error | null
  };
}

// ファイルアップロード用のヘルパーフック
interface UseFileUploadOptions {
  onSuccess?: (fileUrl: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<string>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { onSuccess, onError, onProgress } = options;
  const { uploadFile: uploadFileMutation, isUploading } = useArtifactMutations();
  const { uploadProgress } = useArtifactsStore();

  const handleUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const fileUrl = await uploadFileMutation(file, onProgress);
      onSuccess?.(fileUrl);
      return fileUrl;
    } catch (error) {
      const uploadError = error as Error;
      onError?.(uploadError);
      throw uploadError;
    }
  }, [uploadFileMutation, onSuccess, onError, onProgress]);

  return {
    uploadFile: handleUpload,
    isUploading,
    progress: uploadProgress,
    error: null // エラーハンドリングは上位コンポーネントで行う
  };
}

// 成果物のメタデータ自動生成ヘルパー
export function generateArtifactMetadata(file: File): ArtifactMetadata {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  // ファイル拡張子からプログラミング言語を推測
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'cs': 'C#',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'vue': 'Vue.js',
    'svelte': 'Svelte'
  };

  // フレームワークの推測（ファイル名から）
  const frameworkMap: Record<string, string> = {
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'next': 'Next.js',
    'nuxt': 'Nuxt.js',
    'gatsby': 'Gatsby'
  };

  const language = fileExtension ? languageMap[fileExtension] : undefined;
  
  let framework: string | undefined;
  const fileName = file.name.toLowerCase();
  for (const [key, value] of Object.entries(frameworkMap)) {
    if (fileName.includes(key)) {
      framework = value;
      break;
    }
  }

  return {
    fileSize: file.size,
    mimeType: file.type,
    language,
    framework,
    difficulty: 'beginner' // デフォルト値、ユーザーが後で変更可能
  };
}