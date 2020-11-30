<template>
    <input type="checkbox"
            v-model="enabled"
            v-if="enable">
    <label :for="'npc-' + id">{{ title }}</label>
    <select :name="id" :id="'npc-' + id"
            v-model="value"
            :disabled="!enabled">
        <option value="random">Al azar</option>
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
    props: ['id', 'title', 'data', 'enable', 'modelValue'],
    data() {
        return {
            enabled: true
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
            if (this.enable && !this.enabled) {
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
