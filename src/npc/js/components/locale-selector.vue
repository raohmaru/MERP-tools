<template>
    <div class="right">
        <select v-model="$i18n.locale">
            <option v-for="loc in $i18n.availableLocales" :value="loc">{{ $i18n.messages[loc]._name_ }}</option>
        </select>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

const locales = {};

export default {
    setup() {
        // get locale reactive object from global instance and assing it as a property
        const { locale } = useI18n({ useScope: 'global' });
        return { locale };
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
                this.$i18n.setLocaleMessage(newLocale, res);
                locales[newLocale] = true;
            }
        }
    }

};
</script>
