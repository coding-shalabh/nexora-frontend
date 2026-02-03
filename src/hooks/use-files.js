'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ============ FILES ============

export function useFiles(params) {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => api.get('/files', { params }),
  });
}

export function useFile(id) {
  return useQuery({
    queryKey: ['files', id],
    queryFn: () => api.get(`/files/${id}`),
    enabled: !!id,
  });
}

export function useRecentFiles(limit = 10) {
  return useQuery({
    queryKey: ['files', 'recent', limit],
    queryFn: () => api.get('/files/recent/list', { params: { limit } }),
  });
}

export function useStarredItems() {
  return useQuery({
    queryKey: ['files', 'starred'],
    queryFn: () => api.get('/files/starred/list'),
  });
}

export function useStorageStats() {
  return useQuery({
    queryKey: ['files', 'storage'],
    queryFn: () => api.get('/files/storage/stats'),
  });
}

export function useCreateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/files', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/files/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['files', id] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/files/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useStarFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, starred }) => api.post(`/files/${id}/star`, { starred }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useMoveFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, folderId }) => api.post(`/files/${id}/move`, { folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

// ============ FOLDERS ============

export function useFolders(parentId = null) {
  return useQuery({
    queryKey: ['folders', parentId],
    queryFn: () => api.get('/files/folders', { params: { parentId } }),
  });
}

export function useFolder(id) {
  return useQuery({
    queryKey: ['folders', id],
    queryFn: () => api.get(`/files/folders/${id}`),
    enabled: !!id,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/files/folders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/files/folders/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folders', id] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/files/folders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useStarFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, starred }) => api.post(`/files/folders/${id}/star`, { starred }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

// ============ HELPER FUNCTIONS ============

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return 'other';

  const typeMap = {
    document: ['doc', 'docx', 'pdf', 'txt', 'rtf', 'odt'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'],
    video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    audio: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
    spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
    code: ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java', 'json', 'md'],
  };

  for (const [type, extensions] of Object.entries(typeMap)) {
    if (extensions.includes(ext)) return type;
  }
  return 'other';
}
