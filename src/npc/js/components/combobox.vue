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
        <template v-for="(val, key) of getData()">
            <option v-if="typeof(val) === 'string'"
                    :value="key">{{ val }}</option>
            <optgroup v-else
                      :label="t(key)">
                <option v-for="(v, k) of val"
                        :value="k">{{ v }}</option>
            </optgroup>
        </template>
    </select>
</template>

<script>
import { sample } from '@utils/random.js'
import { flat } from '@utils/object.js'

export default {
    props: ['id', 'title', 'randomLabel', 'data', 'showEnable', 'enabled', 'group', 'sort', 'modelValue'],
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
        getData(data) {
            let arr = [];
            data = data || this.data || [];
            data.forEach(it => {
                if (typeof it === 'string') {
                    arr.push([it, this.t(it)]);
                } else {
                    for (const [key, value] of Object.entries(it)) {
                        arr.push([key, this.getData(value)]);
                    }
                }
            });
            if (this.sort) {
                arr = arr.sort((a, b) => a[1] > b[1] ? 1 : -1);
            }
            return arr.reduce((acc, v) => {
                acc[v[0]] = v[1];
                return acc;
            }, {});
        },

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
