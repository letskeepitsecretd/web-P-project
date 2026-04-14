const itemOperations = {
    items: [],
    add(itemObject) {
        this.items.push(itemObject);
    },
    search(id) {
        return this.items.find(itemObject => itemObject.id == id);
    },
    remove(id) {
        this.items = this.items.filter(itemObject => itemObject.id != id);
        return this.items;
    },
    searchAll(key, value) {
        return this.items.filter(itemObject => itemObject[key] == value);
    },
    sortRecord() {
        return this.items.sort((a, b) => a.id - b.id);
    }
}
