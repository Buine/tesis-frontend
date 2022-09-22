function handleFilter (items) {
    return (searchValue) => {
        if (searchValue.length === 0) {
            return items;
        }
        let updatedItems = []
        items.forEach((list) => {
        if (list.items == undefined) { return }
        const newItems = list.items.filter((item) => {
            return item.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        updatedItems.push({ ...list, items: newItems });
        });
        return updatedItems;
    };
}; 

function handleFilterWithoutGroup (items) {
    return (searchValue) => {
        if (searchValue.length === 0) {
            return items;
        }
        return items.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
    };
};

export {
    handleFilter,
    handleFilterWithoutGroup
}