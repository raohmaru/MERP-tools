import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import App from './app.vue'
import Items from './plugins/items.js'

const i18n = new createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    messages: {
        en: {},
        es: {}
    }
});

createApp(App)
    .use(i18n)
    .use(Items)
    .mount('#npcgen');
