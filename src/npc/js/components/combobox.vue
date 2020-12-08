<template>
    <input type="checkbox"
           :id="id + '-enable'"
           v-model="disabled"
           v-if="showEnable">
    <label :for="id + (showEnable ? '-enable' : '')">{{ $t(title) }}</label>
    <select :name="id" :id="id"
            v-model="value"
            :disabled="showEnable && !disabled">
        <option value="random">{{ $t(randomLabel || 'randomly') }}</option>
        <template v-for="(val, key) of data">
            <option v-if="typeof(val) === 'string'"
                    :value="val">{{ t(val) }}</option>
            <optgroup v-else
                      v-for="(gv, gk) of val"
                      :label="t(gk)">
                <option v-for="(v, k) of gv"
                        :value="v">{{ t(v) }}</option>
            </optgroup>
        </template>
    </select>
</template>

<script>
import { sample } from '@utils/random.js'
import { flat } from '@utils/object.js'

export default {
    props: ['id', 'title', 'randomLabel', 'data', 'showEnable', 'enabled', 'group', 'modelValue'],
    emits: ['update:modelValue'],

    data() {
        return {
            disabled: this.enabled
        };
    },

    mounted() {
        this.localeGroup = this.group ? `${this.group}.` : '';
    },
    
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    },

    watch: {
        data(newValue) {
            this.flatData = newValue.flatMap(it => typeof it === 'string' ? it : Object.values(flat(it)));
        }
    },

    methods: {
        getValue() {
            if (this.showEnable && !this.disabled) {
                return null;
            }
            const id = this.value === 'random' ? sample(this.flatData) : this.value;
            return id;
        },

        t(id) {
            return this.$i18n.t(this.localeGroup + id);
        }
    }
};
</script>
