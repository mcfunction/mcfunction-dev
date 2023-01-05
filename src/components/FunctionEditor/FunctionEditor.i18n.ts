import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

if (Object.keys(i18next.options).length === 0) {
  i18next.use(initReactI18next).init({
    fallbackLng: 'en',
  })
}

i18next.addResources('ja', 'translation', {
  'Add Below': '下に追加',
  'Copy URL': 'URLをコピー',
  'Drop your ZIP': 'ZIPファイルをドロップ',
  'Rename to...': '名前を変更する...',
  Add: '追加',
  Comment: 'コメント',
  Copy: 'コピー',
  Delete: '削除',
  Description: '説明',
  Icon: 'アイコン',
  Information: '情報',
  Language: '言語',
  Name: '名前',
  Namespace: 'ネームスペース',
  Refresh: '更新',
  Rename: '名前を変更',
  Run: '実行',
  Reset: 'リセット',
})
