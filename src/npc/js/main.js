import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import App from './app.vue'
import Items from './plugins/items.js'

const i18n = new createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {
            _name_: 'English'
        },
        es: {
            _name_: 'Español'
        }
    }
});

createApp(App)
    .use(i18n)
    .use(Items)
    .mount('#npcgen');
