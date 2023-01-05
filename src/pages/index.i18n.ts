import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

if (Object.keys(i18next.options).length === 0) {
  i18next.use(initReactI18next).init({
    fallbackLng: 'en',
  })
}

i18next.addResources('ja', 'translation', {
  Commands: 'コマンド一覧',
})
