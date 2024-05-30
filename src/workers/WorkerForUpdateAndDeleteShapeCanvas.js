
if (typeof window !== 'undefined') {

    self.onmessage = function (event) {
        const { type, data, prevSceneData } = event.data;

        if (type === 'update') {
            handleShapeUpdated(data, prevSceneData);
        } else if (type === 'delete') {
            handleDeleteShape(data, prevSceneData);
        } else {
            throw new Error('Unknown action type');
        }
    };

    function handleShapeUpdated(data, prevSceneData) {
        let found = false;// more of an edge case, that if user 1 is drawing  and the other folks are receving the stream and lets say user 2 or 3 refreshes the page and the element is not found in the scene coz it would not have had gotten added in the db. hence we maintain the flag 

        const newElements = prevSceneData.map((el) => {
            if (el.id === data.id) {
                found = true;
                return data;
            }
            return el;
        });
        if (!found) {
            newElements.push(data); // Append the new element if not found
        }
        self.postMessage(newElements);
    }

    function handleDeleteShape(data, prevSceneData) {
        const newElements = prevSceneData.filter((el) => el.id !== data);
        self.postMessage(newElements);
    }
}