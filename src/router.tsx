import React from 'react'

export type AppMode = 'assessment' | 'admin'

export function getAppMode(): AppMode {
  const path = window.location.pathname
  
  // Check for admin routes explicitly
  if (path === '/admin' || path.startsWith('/admin/')) {
    return 'admin'
  }
  
  // Everything else defaults to assessment (including root)
  return 'assessment'
}

export function handleNavigation() {
  // Clean URL handling - no need to update URLs
  // Automatically route based on path
}

export function navigateToAdmin() {
  window.history.pushState(null, '', '/admin')
  window.location.reload()
}

export function navigateToAssessment() {
  window.history.pushState(null, '', '/')
  window.location.reload()
}