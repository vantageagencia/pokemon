// Inventory system
const Inventory = {
    items: {},

    init() {
        // Start with some basic items
        this.addItem('potion', 5);
        this.addItem('pokeball', 5);
    },

    addItem(itemId, count = 1) {
        if (!this.items[itemId]) {
            this.items[itemId] = 0;
        }
        this.items[itemId] += count;
    },

    removeItem(itemId, count = 1) {
        if (this.items[itemId]) {
            this.items[itemId] -= count;
            if (this.items[itemId] <= 0) {
                delete this.items[itemId];
            }
            return true;
        }
        return false;
    },

    hasItem(itemId) {
        return (this.items[itemId] || 0) > 0;
    },

    getCount(itemId) {
        return this.items[itemId] || 0;
    },

    getItemList() {
        return Object.entries(this.items)
            .filter(([id, count]) => count > 0)
            .map(([id, count]) => ({
                id,
                data: ItemDB[id],
                count
            }));
    },

    getBallItems() {
        return this.getItemList().filter(item => item.data && item.data.type === 'ball');
    },

    getMedicineItems() {
        return this.getItemList().filter(item => item.data && item.data.type === 'medicine');
    },

    getKeyItems() {
        return this.getItemList().filter(item => item.data && item.data.type === 'key');
    },

    toJSON() {
        return { items: { ...this.items } };
    },

    fromJSON(data) {
        this.items = { ...data.items };
    }
};
