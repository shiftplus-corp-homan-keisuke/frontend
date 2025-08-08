import type { 
  Artifact, 
  CreateArtifactRequest, 
  UpdateArtifactRequest,
  GetArtifactsQuery,
  ApiResponse,
  PaginatedResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 成果物一覧取得
export async function getArtifacts(query?: GetArtifactsQuery): Promise<PaginatedResponse<Artifact>> {
  const params = new URLSearchParams();
  
  if (query?.userId) params.append('userId', query.userId);
  if (query?.taskId) params.append('taskId', query.taskId);
  if (query?.phaseId) params.append('phaseId', query.phaseId);
  if (query?.type) params.append('type', query.type);
  if (query?.isPublic !== undefined) params.append('isPublic', query.isPublic.toString());
  if (query?.tags?.length) params.append('tags', query.tags.join(','));
  if (query?.page) params.append('_page', query.page.toString());
  if (query?.limit) params.append('_limit', query.limit.toString());

  const response = await fetch(`${API_BASE_URL}/artifacts?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch artifacts: ${response.statusText}`);
  }

  const data = await response.json();
  const total = parseInt(response.headers.get('X-Total-Count') || '0');
  
  return {
    data: data.map((artifact: any) => ({
      ...artifact,
      createdAt: new Date(artifact.createdAt),
      updatedAt: new Date(artifact.updatedAt)
    })),
    total,
    page: query?.page || 1,
    limit: query?.limit || 10,
    hasMore: (query?.page || 1) * (query?.limit || 10) < total,
    timestamp: new Date()
  };
}

// 成果物詳細取得
export async function getArtifact(id: string): Promise<ApiResponse<Artifact>> {
  const response = await fetch(`${API_BASE_URL}/artifacts/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch artifact: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    data: {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    },
    success: true,
    timestamp: new Date()
  };
}

// 成果物作成
export async function createArtifact(request: CreateArtifactRequest): Promise<ApiResponse<Artifact>> {
  const artifactData = {
    ...request,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const response = await fetch(`${API_BASE_URL}/artifacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(artifactData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create artifact: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    data: {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    },
    success: true,
    message: '成果物が正常に作成されました',
    timestamp: new Date()
  };
}

// 成果物更新
export async function updateArtifact(id: string, request: UpdateArtifactRequest): Promise<ApiResponse<Artifact>> {
  const updateData = {
    ...request,
    updatedAt: new Date().toISOString()
  };

  const response = await fetch(`${API_BASE_URL}/artifacts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update artifact: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    data: {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    },
    success: true,
    message: '成果物が正常に更新されました',
    timestamp: new Date()
  };
}

// 成果物削除
export async function deleteArtifact(id: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/artifacts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete artifact: ${response.statusText}`);
  }

  return {
    data: undefined,
    success: true,
    message: '成果物が正常に削除されました',
    timestamp: new Date()
  };
}

// ファイルアップロード（ローカルストレージ用）
export async function uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // ローカルストレージ用のファイル処理
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        // ファイルをBase64形式でローカルストレージに保存
        const fileId = crypto.randomUUID();
        const fileData = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: result,
          uploadedAt: new Date().toISOString()
        };
        
        // ローカルストレージに保存
        const existingFiles = JSON.parse(localStorage.getItem('uploaded-files') || '[]');
        existingFiles.push(fileData);
        localStorage.setItem('uploaded-files', JSON.stringify(existingFiles));
        
        // ファイルURLを返す（実際のプロジェクトではS3やCloudinaryのURLになる）
        const fileUrl = `local://files/${fileId}`;
        resolve(fileUrl);
      };
      
      reader.onerror = () => {
        reject(new Error('ファイルの読み込みに失敗しました'));
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

// ローカルストレージからファイルデータを取得
export function getLocalFile(fileUrl: string): { name: string; data: string; type: string } | null {
  if (!fileUrl.startsWith('local://files/')) {
    return null;
  }
  
  const fileId = fileUrl.replace('local://files/', '');
  const existingFiles = JSON.parse(localStorage.getItem('uploaded-files') || '[]');
  const file = existingFiles.find((f: any) => f.id === fileId);
  
  return file ? { name: file.name, data: file.data, type: file.type } : null;
}

// ファイル削除
export function deleteLocalFile(fileUrl: string): boolean {
  if (!fileUrl.startsWith('local://files/')) {
    return false;
  }
  
  const fileId = fileUrl.replace('local://files/', '');
  const existingFiles = JSON.parse(localStorage.getItem('uploaded-files') || '[]');
  const filteredFiles = existingFiles.filter((f: any) => f.id !== fileId);
  
  localStorage.setItem('uploaded-files', JSON.stringify(filteredFiles));
  return true;
}

// タグの自動補完用データ取得
export async function getPopularTags(): Promise<string[]> {
  try {
    const response = await getArtifacts({ limit: 1000 });
    const allTags = response.data.flatMap(artifact => artifact.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag]) => tag);
  } catch (error) {
    console.error('Failed to fetch popular tags:', error);
    return [];
  }
}

// 成果物の統計情報取得
export async function getArtifactStats(userId: string): Promise<{
  totalArtifacts: number;
  artifactsByType: Record<string, number>;
  artifactsByPhase: Record<string, number>;
  recentArtifacts: Artifact[];
}> {
  try {
    const response = await getArtifacts({ userId, limit: 1000 });
    const artifacts = response.data;
    
    const artifactsByType = artifacts.reduce((acc, artifact) => {
      acc[artifact.type] = (acc[artifact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const artifactsByPhase = artifacts.reduce((acc, artifact) => {
      acc[artifact.phaseId] = (acc[artifact.phaseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentArtifacts = artifacts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    
    return {
      totalArtifacts: artifacts.length,
      artifactsByType,
      artifactsByPhase,
      recentArtifacts
    };
  } catch (error) {
    console.error('Failed to fetch artifact stats:', error);
    return {
      totalArtifacts: 0,
      artifactsByType: {},
      artifactsByPhase: {},
      recentArtifacts: []
    };
  }
}