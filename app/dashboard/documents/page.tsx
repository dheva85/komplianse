'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type StorageFile = {
  name: string
  id: string | null
  updated_at: string | null
  metadata: { size: number } | null
  path: string
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  const loadFiles = async () => {
    const supabase = createClient()
    const { data: authData } = await supabase.auth.getUser()
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_user_id', authData?.user?.id)
      .single()

    if (!company?.id) {
      setFiles([])
      return
    }

    const folder = `company-${company.id}`
    const { data, error } = await supabase.storage.from('documents').list(folder)

    if (error) {
      setStatus('Unable to load documents yet.')
      return
    }

    setFiles((data ?? []).map((file: any) => ({
      ...file,
      path: `${folder}/${file.name}`,
    })))
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setStatus('')

    try {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_user_id', authData?.user?.id)
        .single()

      if (!company?.id) {
        throw new Error('Unable to determine your company.')
      }

      const folder = `company-${company.id}`
      const filePath = `${folder}/${Date.now()}-${selectedFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      setStatus('Upload complete. Refreshing...')
      setSelectedFile(null)
      await loadFiles()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed.'
      setStatus(message)
    } finally {
      setUploading(false)
    }
  }

  const publicUrl = (path: string) => {
    const supabase = createClient()
    return supabase.storage.from('documents').getPublicUrl(path).data.publicUrl
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">Document vault</p>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">Secure file storage</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">Upload employee documents and keep HR records in one shared space.</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] items-end">
          <label className="block">
            <span className="text-sm text-[var(--color-text-secondary)]">Select a file</span>
            <input
              type="file"
              accept="application/pdf,image/*,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-sm text-[var(--color-text-primary)]"
            />
          </label>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="btn-primary w-full py-3"
          >
            {uploading ? 'Uploading…' : 'Upload document'}
          </button>
        </div>
        {status && <p className="text-sm text-[var(--color-text-secondary)]">{status}</p>}
      </div>

      <div className="glass-card p-8">
        <h2 className="text-lg font-semibold mb-4">Uploaded files</h2>
        {files.length === 0 ? (
          <p className="text-[var(--color-text-secondary)]">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {files.map((file: any) => (
              <div key={file.id} className="flex flex-col gap-2 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {file.updated_at ? new Date(file.updated_at).toLocaleDateString('en-MY') : 'Unknown date'}
                  </p>
                </div>
                <a
                  href={publicUrl(file.path)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
