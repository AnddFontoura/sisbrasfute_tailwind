import { defineStore } from 'pinia'
import { notificationsService } from '@/services/notificationsService'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    latest: [],
    unreadCount: 0,
    loading: false,
  }),
  getters: {
    hasUnread: (state) => state.unreadCount > 0,
  },
  actions: {
    async fetchLatest() {
      this.loading = true
      try {
        const [latestRes, countRes] = await Promise.all([
          notificationsService.latest(),
          notificationsService.unreadCount(),
        ])
        this.latest = latestRes.data || []
        this.unreadCount = countRes.data?.unread_count ?? 0
      } catch {
        // Silent: bell should not break the layout on failure
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const { data } = await notificationsService.unreadCount()
        this.unreadCount = data?.unread_count ?? 0
      } catch {
        // Silent
      }
    },

    async markAsRead(notificationUserId) {
      await notificationsService.markAsRead(notificationUserId)
      const item = this.latest.find((n) => n.id === notificationUserId)
      if (item && !item.read_at) {
        item.read_at = new Date().toISOString()
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    async markAllAsRead() {
      await notificationsService.markAllAsRead()
      this.latest.forEach((n) => {
        if (!n.read_at) n.read_at = new Date().toISOString()
      })
      this.unreadCount = 0
    },

    reset() {
      this.latest = []
      this.unreadCount = 0
    },
  },
})
