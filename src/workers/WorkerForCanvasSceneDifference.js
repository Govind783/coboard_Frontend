const findDifferences = (currentElements, newElements, versionsMap) => {
    const currentIds = new Set(currentElements.map(el => el.id));
    const newMap = new Map(newElements.map(el => [el.id, el]));

    const added = [];
    const updated = [];

    newElements.forEach(el => {
        if (!currentIds.has(el.id)) {
            added.push(el);
        } else if (currentIds.has(el.id) && newMap.get(el.id).version > versionsMap.get(el.id)) {
            updated.push(el);
        }
    });

    // Flatten any nested arrays within added and updated arrays
    const flattenArray = (arr) => {
        return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val), []);
    };

    return { added: flattenArray(added), updated: flattenArray(updated) };
};

self.onmessage = (e) => {
    const { currentElements, newElements, versionsMap } = e.data;
    const differences = findDifferences(currentElements, newElements, versionsMap);
    self.postMessage(differences);
}