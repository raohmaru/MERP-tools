import { ref } from 'vue';

const items = ref([]);  // creates a reactive and mutable ref object
let itemsDef = {};

function setup(data) {
    itemsDef = data;
}

function add(id, model) {
    const item = itemsDef[model || id];
    // Reactive objects does not triggers a change unless they are replaced
    items.value = [...items.value, {
        ...item,
        id
    }];
}

function remove(id) {
    items.value = items.value.filter(it => it.id !== id);
}

function get(id) {
    for (let i = 0; i < items.value.length; i++) {
        if (items.value[i].id === id) {
            return items.value[i];
        }
    }
    return {};
}

function getAll() {
    return items.value;
}

function getRef() {
    return items;
}

export default {
    install: (app, options) => {
        app.config.globalProperties.$items = {
            setup,
            add,
            remove,
            get,
            getAll,
            getRef
        };
    }
}