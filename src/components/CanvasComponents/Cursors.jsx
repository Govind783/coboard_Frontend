import React from 'react'
import cursorImage from "../../assets/cursorForCanvas.png"

const Cursors = () => {
     // const [cursors, setCursors] = useState({});

  // useEffect(() => {
  //   const handleCursorMoved = (data) => {
  //     setCursors(prevCursors => ({
  //       ...prevCursors,
  //       [data.userId]: { x: data.x, y: data.y, userName: data.userName }
  //     }));
  //   };

  //   socketState.on("cursorMoved", handleCursorMoved);

  //   return () => {
  //     socketState.off("cursorMoved", handleCursorMoved);
  //   };
  // }, [socketState]);


  // const handleMouseMove = useCallback(throttle((event) => {
  //   const { clientX, clientY } = event;
  //   const cursorData = {
  //     x: clientX,
  //     y: clientY,
  //     userId: getCookiesNext("userId"),
  //     userName: getCookiesNext("userName"),
  //   };
  //   setCursors(prevCursors => ({
  //     ...prevCursors,
  //     [cursorData.userId]: cursorData
  //   }));
  //   socketState.emit("cursorMove", cursorData);
  // }, 500), [excalidrawAPIState]);

  // useEffect(() => {
  //   const canvasElement = document.querySelector('.excalidraw__canvas.interactive');
  //   if (canvasElement) {
  //     canvasElement.addEventListener('mousemove', handleMouseMove);

  //     return () => {
  //       canvasElement.removeEventListener('mousemove', handleMouseMove);
  //     };
  //   }
  // }, [handleMouseMove]); 
  
     // const Cursor = React.memo(({ x, y, userName, color }) => (
  //   <div style={{
  //     position: 'absolute',
  //     left: `${x}px`,
  //     top: `${y}px`,
  //     width: '20px',
  //     height: '20px',
  //     borderRadius: '50%',
  //     background: color,
  //     transform: 'translate(-50%, -50%)',
  //     zIndex: 1000,
  //     display: 'flex',
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //     pointerEvents: 'none'  // This allows clicks to pass through the cursor element
  //   }}>
  //     <div style={{
  //       color: '#fff',
  //       fontSize: '12px',
  //       marginTop: '24px',
  //       whiteSpace: 'nowrap',
  //       background: '#333',
  //       padding: '2px 4px',
  //       borderRadius: '4px'
  //     }}>
  //       {userName.slice(0,3)}
  //     </div>
  //   </div>
  // ));

  // const renderCursors = () => {
  //   const myUserId = getCookiesNext("userId");
  //   return Object.entries(cursors).map(([userId, { x, y, userName }]) => (
  //     <Cursor key={userId} x={x} y={y} userName={userName} color={userId === myUserId ? 'blue' : 'red'} />
  //   ));
  // };

  return (
    <div>
        {/* {renderCursors()} */}

    </div>
  )
}

export default Cursors