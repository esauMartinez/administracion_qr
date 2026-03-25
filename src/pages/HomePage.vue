<script setup lang="ts">
import { useQrs } from '@/composables/useQrs'
import QRCode from 'qrcode'
import { ref, watch } from 'vue'

const { guias, isLoading } = useQrs()

const qrCCPImages = ref<Record<string, string>>({})

const generateQrCCP = async (id: string, url: string) => {
  if (!url) return
  try {
    qrCCPImages.value[id] = await QRCode.toDataURL(url, { width: 150, margin: 1 })
  } catch {
    qrCCPImages.value[id] = ''
  }
}

const openQrCCP = (url: string) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

watch(guias, (newGuias) => {
  newGuias.forEach((g) => generateQrCCP(g.guia, g.qrCCP))
})

const getStatusClass = (estatus: string): string => {
  const statusMap: Record<string, string> = {
    success: 'active',
    canceled: 'cancelled',
  }
  return statusMap[estatus?.toLowerCase()] || 'unknown'
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>📋 Gestión de QR</h1>
      <p class="subtitle">Visualiza y gestiona tus códigos QR</p>
    </div>

    <div v-if="guias.length > 0">
      <!-- Desktop View: Table -->
      <table class="qr-table">
        <thead>
          <tr>
            <th>Guía</th>
            <th>QR CP</th>
            <th>QR CCP</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guia in guias" :key="guia.guia" class="table-row">
            <td class="guia-cell">{{ guia.guia }}</td>
            <td>
              <iframe
                :srcdoc="`<html><body style='margin:0;padding:8px;'><img src='data:image/png;base64,${guia.qr}' style='max-width:100%;height:auto;display:block;'></body></html>`"
                class="qr-iframe"
              ></iframe>
            </td>
            <td>
              <div class="qr-ccp-content">
                <img
                  v-if="qrCCPImages[guia.guia]"
                  :src="qrCCPImages[guia.guia]"
                  class="qr-ccp-img"
                  alt="QR CCP"
                />
                <span v-else class="qr-loading">...</span>
                <button
                  type="button"
                  class="qr-ccp-button"
                  :disabled="!guia.qrCCP"
                  @click="openQrCCP(guia.qrCCP)"
                >
                  Abrir CCP
                </button>
              </div>
            </td>
            <td class="status-cell">
              <span class="status-badge" :class="getStatusClass(guia.estatus)">
                {{ guia.estatus === 'canceled' ? 'Cancelado' : 'Activo' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile View: Cards -->
      <div class="mobile-cards">
        <div v-for="guia in guias" :key="guia.guia" class="qr-card">
          <div class="card-header">
            <h3 class="card-title">Guía: {{ guia.guia }}</h3>
            <span class="status-badge" :class="getStatusClass(guia.estatus)">
              {{ guia.estatus === 'canceled' ? 'Cancelado' : 'Activo' }}
            </span>
          </div>
          <div class="card-qrs">
            <div class="card-qr-item">
              <p class="card-qr-label">QR CP</p>
              <iframe
                :srcdoc="`<html><body style='margin:0;padding:8px;'><img src='data:image/png;base64,${guia.qr}' style='width:100%;height:auto;display:block;'></body></html>`"
                class="card-iframe"
              ></iframe>
            </div>
            <div class="card-qr-item">
              <p class="card-qr-label">QR CCP</p>
              <div class="card-qr-ccp-content">
                <div class="card-iframe card-iframe-ccp">
                  <img
                    v-if="qrCCPImages[guia.guia]"
                    :src="qrCCPImages[guia.guia]"
                    style="width: 100%; height: auto; display: block"
                    alt="QR CCP"
                  />
                  <span v-else class="qr-loading">...</span>
                </div>
                <button
                  type="button"
                  class="qr-ccp-button"
                  :disabled="!guia.qrCCP"
                  @click="openQrCCP(guia.qrCCP)"
                >
                  Abrir CCP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-data" v-if="isLoading">
      <div class="loading-wrapper" role="status" aria-live="polite">
        <span class="spinner-loader" aria-hidden="true"></span>
        <p class="loading-text">Cargando datos...</p>
      </div>
    </div>

    <div class="no-data" v-if="guias.length === 0 && !isLoading">
      <p>📭 No hay códigos QR disponibles</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

h1 {
  font-size: 32px;
  margin: 0;
  color: #1a1a1a;
  font-weight: 700;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 14px;
}

/* TABLE STYLES - Desktop */
.qr-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: table;
}

.qr-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.qr-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qr-table tbody {
  display: table-row-group;
}

.table-row {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f9f9ff;
}

.table-row:last-child {
  border-bottom: none;
}

.qr-table td {
  padding: 16px;
  vertical-align: middle;
  font-size: 14px;
}

.guia-cell {
  font-weight: 600;
  color: #333;
}

.qr-cell {
  text-align: center;
}

.status-cell {
  text-align: center;
}

.qr-ccp-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qr-iframe {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  width: 120px;
  height: 120px;
  display: inline-block;
  background-color: #fff;
  transition: box-shadow 0.2s ease;
}

.qr-iframe:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* STATUS BADGES */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.status-badge.cancelled {
  background-color: #e05d4b;
  color: #ffffff;
  border: 1px solid #f9fafc;
}

.status-badge.unknown {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

/* MOBILE CARDS - Hidden on desktop */
.mobile-cards {
  display: none;
  grid-template-columns: 1fr;
  gap: 16px;
}

.qr-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
}

.qr-card:active {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-qrs {
  display: flex;
  gap: 12px;
  background: #f9f9ff;
  padding: 12px;
  border-radius: 6px;
}

.card-qr-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.card-qr-label {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 0.4px;
}

.card-iframe {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  width: 100%;
  height: 160px;
  background-color: #fff;
}

.card-iframe-ccp {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.card-qr-ccp-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qr-ccp-img {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  width: 120px;
  height: 120px;
  background-color: #fff;
  transition: box-shadow 0.2s ease;
  padding: 18px;
}

.qr-ccp-img:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.qr-ccp-button {
  min-width: 120px;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.qr-ccp-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(102, 126, 234, 0.28);
}

.qr-ccp-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.qr-loading {
  color: #bbb;
  font-size: 20px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}

.loading-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.spinner-loader {
  width: 44px;
  height: 44px;
  border: 4px solid #e8ecff;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  letter-spacing: 0.3px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVE - Tablet */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  h1 {
    font-size: 24px;
  }

  .qr-table {
    display: none;
  }

  .mobile-cards {
    display: grid;
  }

  .qr-iframe {
    width: 100px;
    height: 100px;
  }
}

/* RESPONSIVE - Mobile */
@media (max-width: 480px) {
  .container {
    padding: 12px;
  }

  .header {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 20px;
  }

  .subtitle {
    font-size: 12px;
  }

  .mobile-cards {
    gap: 12px;
  }

  .qr-card {
    padding: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-title {
    font-size: 14px;
    width: 100%;
  }

  .status-badge {
    width: 100%;
    text-align: center;
  }

  .card-qr {
    padding: 8px;
  }

  .card-iframe {
    max-width: 100%;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  .qr-ccp-button {
    width: 100%;
  }

  .no-data {
    padding: 40px 20px;
    font-size: 16px;
  }

  .spinner-loader {
    width: 38px;
    height: 38px;
  }

  .loading-text {
    font-size: 14px;
  }
}
</style>
