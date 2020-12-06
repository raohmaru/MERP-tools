<template>
    <input type="checkbox"
           :id="id + '-enable'"
           v-model="disabled"
           v-if="showEnable">
    <label :for="id + (showEnable ? '-enable' : '')">{{ title }}</label>
    <select :name="id" :id="id"
            v-model="value"
            :disabled="showEnable && !disabled">
        <option value="random">{{ randomLabel || 'Al azar' }}</option>
        <template v-for="(val, key) of data">
            <option v-if="typeof(val) === 'string'"
                    :value="key">{{ val }}</option>
            <optgroup v-else
                      :label="key">
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
    props: ['id', 'title', 'randomLabel', 'data', 'showEnable', 'enabled', 'modelValue'],

    data() {
        return {
            disabled: this.enabled
        };
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
            this.flatData = flat(newValue);
        }
    },

    methods: {
        getValue() {
            if (this.showEnable && !this.disabled) {
                return {};
            }
            const id = this.value === 'random' ? sample(Object.keys(this.flatData)) : this.value;
            return {
                id,
                label: this.flatData[id]
            };
        }
    }
};
</script>
