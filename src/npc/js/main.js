import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import App from './app.vue'

const i18n = new createI18n({
    locale: 'es',
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
    .mount('#npcgen');
