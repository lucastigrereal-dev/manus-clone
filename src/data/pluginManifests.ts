export interface OmnisPlugin {
  id: string
  manifest: { name: string; version: string; factory: string; description: string; author: string }
  installed: boolean
  rating: number
  downloads: number
}

export const PLUGIN_CATALOG: OmnisPlugin[] = [
  { id: 'p1', manifest: { name: 'SEO Analyzer', version: '1.2.0', factory: 'Research', description: 'Analisa SEO de páginas e concorrentes', author: 'OMNIS Labs' }, installed: true, rating: 4.5, downloads: 1240 },
  { id: 'p2', manifest: { name: 'Instagram Scheduler', version: '0.9.1', factory: 'Content', description: 'Agenda posts automáticos no Instagram', author: 'Muse Team' }, installed: false, rating: 4.2, downloads: 890 },
  { id: 'p3', manifest: { name: 'Lead Qualifier', version: '2.0.0', factory: 'Commercial', description: 'Qualifica leads com score AI', author: 'SDR Ops' }, installed: false, rating: 4.8, downloads: 2100 },
  { id: 'p4', manifest: { name: 'PDF Generator', version: '1.0.3', factory: 'Report', description: 'Gera PDFs com template customizável', author: 'DocFactory' }, installed: true, rating: 3.9, downloads: 560 },
  { id: 'p5', manifest: { name: 'Webhook Trigger', version: '1.1.0', factory: 'Automation', description: 'Dispara webhooks em eventos OMNIS', author: 'OMNIS Labs' }, installed: false, rating: 4.6, downloads: 1800 },
  { id: 'p6', manifest: { name: 'Voice Transcriber', version: '0.5.0', factory: 'Research', description: 'Transcreve reuniões e gera atas', author: 'AudioAI' }, installed: false, rating: 4.0, downloads: 430 },
]
