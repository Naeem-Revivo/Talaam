import axiosClient from './client';

/**
 * Get all announcements
 */
export const getAnnouncements = async (params = {}) => {
  const { page, pageSize, status, targetAudience } = params;
  const queryParams = new URLSearchParams();
  
  if (page) queryParams.append('page', page);
  if (pageSize) queryParams.append('pageSize', pageSize);
  if (status) queryParams.append('status', status);
  if (targetAudience) queryParams.append('targetAudience', targetAudience);
  
  const queryString = queryParams.toString();
  const url = `/admin/announcements${queryString ? `?${queryString}` : ''}`;
  
  const response = await axiosClient.get(url);
  return response.data;
};

/**
 * Get announcement by ID
 */
export const getAnnouncementById = async (announcementId) => {
  const response = await axiosClient.get(`/admin/announcements/${announcementId}`);
  return response.data;
};

/**
 * Create announcement
 */
export const createAnnouncement = async (announcementData) => {
  const response = await axiosClient.post('/admin/announcements', announcementData);
  return response.data;
};

/**
 * Update announcement
 */
export const updateAnnouncement = async (announcementId, announcementData) => {
  const response = await axiosClient.put(`/admin/announcements/${announcementId}`, announcementData);
  return response.data;
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (announcementId) => {
  const response = await axiosClient.delete(`/admin/announcements/${announcementId}`);
  return response.data;
};

/**
 * Toggle publish status
 */
export const togglePublishStatus = async (announcementId, isPublished) => {
  const response = await axiosClient.put(`/admin/announcements/${announcementId}/publish`, { isPublished });
  return response.data;
};

/**
 * Get active announcements for the current user (with read status)
 */
export const getUserAnnouncements = async () => {
  const response = await axiosClient.get('/admin/announcements/user');
  return response.data;
};

/**
 * Mark announcement as read for the current user
 */
export const markAnnouncementAsRead = async (announcementId) => {
  const response = await axiosClient.post(`/admin/announcements/${announcementId}/read`);
  return response.data;
};

/**
 * Get unread announcement count for the current user
 */
export const getUnreadCount = async () => {
  const response = await axiosClient.get('/admin/announcements/unread-count');
  return response.data;
};

/**
 * Delete announcement for the current user (mark as deleted)
 */
export const deleteAnnouncementForUser = async (announcementId) => {
  const response = await axiosClient.delete(`/admin/announcements/${announcementId}/user`);
  return response.data;
};
