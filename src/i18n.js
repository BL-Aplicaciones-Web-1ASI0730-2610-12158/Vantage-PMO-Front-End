import en from './view1/locales/en.json';
import es from './view1/locales/es.json';

import {createI18n} from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: 'en',
    messages: {en, es}
})

export default i18n;