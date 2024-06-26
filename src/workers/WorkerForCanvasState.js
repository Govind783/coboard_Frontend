import axios from 'axios';

if (typeof window !== 'undefined') {
    self.onmessage = async function (e) {
        const formData = new FormData();
        formData.append('board_uuid', e.data.board_uuid);
        try {
            const canvasState = await axios.post(`${e.data.backendDomain}/retrieveCanvasState`, formData, {
                headers: { "Content-Type": "application/json" }
            });
            if (canvasState.data.data?.length > 0) {
                self.postMessage(canvasState.data.data);
            } else if (canvasState.data.data?.length === 0) {
                self.postMessage([]);
            } else {
                self.postMessage(null);
            }
        }
        catch (e) {
            console.log(e)
            self.postMessage(null);
        }
    };
}
