import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import { App } from './App'

// Register service worker
registerSW({
  onNeedRefresh() {
    // New content available, prompt user to refresh
    if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log('オフラインで利用可能です')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
