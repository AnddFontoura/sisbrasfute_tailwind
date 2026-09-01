import api from "@/services/api"

export const notificationsService = {
  // User-facing
  list(params) {
    return api.get("/notifications", { params })
  },

  latest() {
    return api.get("/notifications/latest")
  },

  unreadCount() {
    return api.get("/notifications/unread-count")
  },

  markAsRead(notificationUserId) {
    return api.post(`/notifications/${notificationUserId}/read`)
  },

  markAllAsRead() {
    return api.post("/notifications/read-all")
  },

  // Admin
  adminList(params) {
    return api.get("/admin/notifications", { params })
  },

  adminSend(payload) {
    return api.post("/admin/notifications", payload)
  },

  adminShow(id) {
    return api.get(`/admin/notifications/${id}`)
  },

  adminUpdate(id, payload) {
    return api.put(`/admin/notifications/${id}`, payload)
  },
}
