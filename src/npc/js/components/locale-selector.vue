<template>
    <div class="right">
        <select v-model="$i18n.locale">
            <option v-for="loc in $i18n.availableLocales" :value="loc">{{ $t(loc) }}</option>
        </select>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

const locales = {};

export default {
    setup() {
        // get some reactive objects from the global i18n instance and assing it as a property
        const { locale, setLocaleMessage } = useI18n({ useScope: 'global' });
        return { locale, setLocaleMessage };
    },

    watch: {
        locale(newValue) {
            this.loadLocale(newValue);
        }
    },

    mounted() {
        this.loadLocale(this.locale);
    },

    methods: {
        async loadLocale(newLocale) {
            if (!locales[newLocale]) {
                const data = await fetch(`data/locales/${newLocale}.json`);
                const res = await data.json();
                this.setLocaleMessage(newLocale, res);
                locales[newLocale] = true;
            }
        }
    }

};
</script>
