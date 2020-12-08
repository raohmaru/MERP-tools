<template>
    <label :for="id">{{ $t(title) }}</label>
    <input type="range" :id="id" :min="min" :max="max" :step="step"
            v-model="value">
    <input type="number" :min="min" :max="max" :step="step"
            v-model="value">%
</template>

<script>
import { randomInt } from '@utils/random.js'

export default {
    emits: ['update:modelValue'],
    props: {
        id: String,
        title: String,
        min: Number,
        max: Number,
        step: Number,
        modelValue: Number
    },

    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', parseInt(value, 10));
            }
        }
    }
};
</script>
