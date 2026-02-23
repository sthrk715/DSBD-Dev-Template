'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { UploadIcon, CheckIcon } from '@/components/icons'

// ── アバター編集エリア ────────────────────────────────────────────
function AvatarSection({
  name,
  email,
  onUpload,
}: {
  name: string
  email: string
  onUpload: () => void
}) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1A1A1A, #404040)' }}
        >
          {initials}
        </div>
        <button
          onClick={onUpload}
          className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="アバターを変更"
        >
          <UploadIcon size={20} className="text-white" />
        </button>
      </div>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-400">{email}</p>
        <button onClick={onUpload} className="mt-2 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">
          写真を変更
        </button>
      </div>
    </div>
  )
}

// ── フォームフィールド ────────────────────────────────────────────
function ProfileFormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  required,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
        required={required}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ── 通知設定 ──────────────────────────────────────────────────────
type NotifKey = 'systemAlerts' | 'weeklyReport' | 'loginAlerts'

function NotificationSettings({
  settings,
  onChange,
}: {
  settings: Record<NotifKey, boolean>
  onChange: (key: NotifKey, v: boolean) => void
}) {
  const items: { key: NotifKey; label: string; description: string }[] = [
    { key: 'systemAlerts', label: 'システムアラート',  description: '障害・エラー発生時に通知' },
    { key: 'weeklyReport', label: '週次レポート',      description: '毎週月曜日にサマリーを送信' },
    { key: 'loginAlerts',  label: 'ログインアラート',  description: '新しいデバイスからのログイン通知' },
  ]

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
          <div>
            <p className="text-sm font-medium text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
          </div>
          <button
            role="switch"
            aria-checked={settings[item.key]}
            onClick={() => onChange(item.key, !settings[item.key])}
            className={`
              relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/40 shrink-0
              ${settings[item.key] ? 'bg-primary-500' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                ${settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}
              `}
            />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── パスワード変更フォーム ────────────────────────────────────────
function PasswordForm() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (form.next !== form.confirm) {return}
    setSaved(true)
    setForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setSaved(false), 3000)
  }

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProfileFormField label="現在のパスワード" type="password" value={form.current} onChange={set('current')} required />
      <ProfileFormField label="新しいパスワード" type="password" value={form.next} onChange={set('next')}
        hint="8文字以上、英数字記号を含む" required />
      <ProfileFormField label="パスワードの確認" type="password" value={form.confirm} onChange={set('confirm')} required />
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary">パスワードを変更</button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success-dark animate-fade-in">
            <CheckIcon size={14} /> 変更しました
          </span>
        )}
      </div>
    </form>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState({
    displayName: '田中 太郎',
    email:       'tanaka@example.com',
    phone:       '090-1234-5678',
    department:  'エンジニアリング',
    timezone:    'Asia/Tokyo',
    language:    'ja',
  })

  const [notif, setNotif] = useState<Record<NotifKey, boolean>>({
    systemAlerts: true,
    weeklyReport: true,
    loginAlerts:  false,
  })

  const [saved, setSaved] = useState(false)

  const set = (key: keyof typeof profile) => (v: string) =>
    setProfile((p) => ({ ...p, [key]: v }))

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="max-w-2xl space-y-8">
            {/* アバター */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-900 mb-5">アバター</h2>
              <AvatarSection
                name={profile.displayName}
                email={profile.email}
                onUpload={() => console.warn('Upload avatar')}
              />
            </div>

            {/* 基本情報 */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-900 mb-5">基本情報</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProfileFormField label="表示名" value={profile.displayName} onChange={set('displayName')} required />
                  <ProfileFormField label="メールアドレス" type="email" value={profile.email} onChange={set('email')} required />
                  <ProfileFormField label="電話番号" type="tel" value={profile.phone} onChange={set('phone')} />
                  <ProfileFormField label="部署" value={profile.department} onChange={set('department')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">タイムゾーン</label>
                    <select value={profile.timezone} onChange={(e) => set('timezone')(e.target.value)} className="select-field">
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">言語</label>
                    <select value={profile.language} onChange={(e) => set('language')(e.target.value)} className="select-field">
                      <option value="ja">日本語</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" className="btn-primary">変更を保存</button>
                  {saved && (
                    <span className="flex items-center gap-1 text-sm text-success-dark animate-fade-in">
                      <CheckIcon size={14} /> 保存しました
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* パスワード */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-900 mb-5">パスワード変更</h2>
              <PasswordForm />
            </div>

            {/* 通知設定 */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-900 mb-5">通知設定</h2>
              <NotificationSettings
                settings={notif}
                onChange={(k, v) => setNotif((n) => ({ ...n, [k]: v }))}
              />
            </div>

            {/* 危険ゾーン */}
            <div className="card border-error-light">
              <h2 className="text-sm font-semibold text-error-dark mb-2">危険ゾーン</h2>
              <p className="text-xs text-gray-500 mb-4">アカウントを削除すると元に戻せません。</p>
              <button className="btn-danger text-sm">アカウントを削除</button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
