import React from 'react'

export type AppMode = 'home' | 'assessment' | 'admin' | 'superadmin'

export function getAppMode(): AppMode {
  const path = window.location.pathname
  
  // Check for superadmin routes first
  if (path === '/superadmin' || path.startsWith('/superadmin/')) {
    return 'superadmin'
  }
  
  // Check for admin routes explicitly
  if (path === '/admin' || path.startsWith('/admin/')) {
    return 'admin'
  }
  
  // Check for assessment routes (including unique assessment URLs)
  if (path === '/assessment' || path.startsWith('/assessment/') || path.startsWith('/a/')) {
    return 'assessment'
  }
  
  // Root defaults to home/landing page
  return 'home'
}

// Get assessment results ID from URL
export function getAssessmentIdFromUrl(): string | null {
  const path = window.location.pathname
  
  // Check for unique assessment URL format: /a/{results_id}
  const match = path.match(/^\/a\/([a-f0-9-]+)$/i)
  return match ? match[1] : null
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

export function navigateToUniqueAssessment(resultsId: string) {
  window.history.pushState(null, '', `/a/${resultsId}`)
  window.location.reload()
}

export function navigateToHome() {
  window.history.pushState(null, '', '/')
  window.location.reload()
}

export function navigateToSuperadmin() {
  window.history.pushState(null, '', '/superadmin')
  window.location.reload()
}