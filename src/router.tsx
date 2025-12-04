import React from 'react'

export type AppMode = 'home' | 'assessment' | 'admin'

export function getAppMode(): AppMode {
  const path = window.location.pathname
  
  // Check for admin routes explicitly
  if (path === '/admin' || path.startsWith('/admin/')) {
    return 'admin'
  }
  
  // Check for assessment routes
  if (path === '/assessment' || path.startsWith('/assessment/')) {
    return 'assessment'
  }
  
  // Root defaults to home/landing page
  return 'home'
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
  window.history.pushState(null, '', '/assessment')
  window.location.reload()
}

export function navigateToHome() {
  window.history.pushState(null, '', '/')
  window.location.reload()
}