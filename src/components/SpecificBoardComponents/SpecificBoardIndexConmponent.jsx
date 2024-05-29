"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import { io } from 'socket.io-client';
import { getCookiesNext } from '@/cookies/cookiesConfig';
import CallingComponent from '../Calling/Index';
import { CgSpinner } from 'react-icons/cg';
import { debounce } from 'lodash';
import axios from 'axios';
import { backendDomainHandler } from '@/generalConfig/BackendAndMiddlewareHelpers';
import { toast } from '../ui/use-toast';
const RichTextEditor = dynamic(() => import('@/components/BlockNoteEditor'), { ssr: false })
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <div className='w-full flex justify-center items-center h-screen'>
      <div className="flex items-center gap-4">
        <CgSpinner className="animate-spin h-12 w-12 text-4xl" />
        <p className="linear-wipe" style={{ color: "#a4a0a0" }}>Setting up Canvas...</p>
      </div>
    </div>
  },
);

const socketState = io(backendDomainHandler(), {
  query: {
    user_id: getCookiesNext("userId"),
  },
})

const SpecificBoardIndexConmponent = () => {

  const router = useRouter()
  const [excalidrawAPIState, setexcalidrawAPIState] = useState(null);
  const initialLoad = useRef(true);
  const [boardTeamMembers, setBoardTeamMembers] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      socketState.emit("readyToUseApp", { boardUuid: router.query.BoardUuid })
      return () => {
        socketState.off("readyToUseApp");
      }
    }
  }, [router.isReady])

  const workerRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!router.isReady || !excalidrawAPIState) return;
      workerRef.current = new Worker(new URL('../../workers/WorkerForCanvasState.js', import.meta.url));

      workerRef.current.postMessage({ board_uuid: router.query.BoardUuid });

      workerRef.current.onmessage = function (e) {
        if (!e.data) return;
        const previousCanvasState = e?.data

        if (previousCanvasState.length > 0) {
          const workerForCanvasSceneDifference = new Worker(new URL('../../workers/WorkerForCanvasSceneDifference.js', import.meta.url));

          workerForCanvasSceneDifference.postMessage({ currentElements: excalidrawAPIState.getSceneElements(), newElements: previousCanvasState, versionsMap });

          workerForCanvasSceneDifference.onmessage = (e) => {
            const { added, updated } = e.data;
            if (added.length > 0 || updated.length > 0) {
              excalidrawAPIState.updateScene({ elements: [...added, ...updated] });
              [...added, ...updated].forEach(el => versionsMap.set(el.id, el.version));
            }
            initialLoad.current = false;
          }

          initialLoad.current = false;
        }
        else {
          initialLoad.current = false;
        }
      };
    })();
  }, [router.isReady, excalidrawAPIState]);

  const renderTopRightUI = () => {
    return (
      <>
        {sessionStorage.getItem("isBoardShared") !== "false" && <CallingComponent teamMembers={boardTeamMembers} socket={socketState} />}

      </>
    );
  };

  useEffect(() => {
    if (sessionStorage.getItem('isBoardShared') !== "false" && router.query.BoardUuid) {
      (async () => {
        const formData = new FormData();
        formData.append('board_uuid', router.query.BoardUuid);
        try {
          const teamMembers = await axios.post(`${backendDomainHandler()}/retrieveTeamMembers`, formData, {
            headers: { "Content-Type": "application/json" }
          });
          if (teamMembers.data.data?.length > 0) {
            setBoardTeamMembers(teamMembers.data.data);
          }
        } catch (err) {
          console.error(err);
          toast({
            title: "Oops! There was an error in loading your team members",
            variant: "destructive"
          })
        }

      })()
    }
  }, [router.isReady])

  const versionsMap = useRef(new Map()).current;
  const [elementsState, setElementsState] = useState({
    elements: [],
  });

  const canvasOnChangeHandler = debounce((allElements, setElementsState, versionsMap, callToBackendToUpdateCanvasState) => {
    // const newIds = new Set(allElements.map(el => el.id));
    const elementsChanged = new Set();

    allElements.forEach(element => {
      const storedVersion = versionsMap.get(element.id) || 0;
      if (!versionsMap.has(element.id)) {
        callToBackendToUpdateCanvasState("addShape", element);
        elementsChanged.add(element.id);
      } else if (element.version > storedVersion && !element.isDeleted) {
        callToBackendToUpdateCanvasState("updateShape", element);
        elementsChanged.add(element.id);
      }
      else if (element.version > storedVersion && element.isDeleted) {
        callToBackendToUpdateCanvasState("deleteShape", { id: element.id });
        versionsMap.delete(element.id);
        elementsChanged.add(element.id);
      }
      versionsMap.set(element.id, element.version);
    });


    if (elementsChanged.size > 0) {
      setElementsState({ elements: allElements });
    }
  }, 1100);


  const handleChange = (elements, appState) => {
    if (initialLoad.current) return;

    // Checking if the event was triggered by the local user.
    if (appState.draggingElement !== null || appState.resizingElement !== null || appState.editingElement !== null || appState.pointerButtonDown || appState.selectedElementIds) {
      canvasOnChangeHandler(elements, setElementsState, versionsMap, callToBackendToUpdateCanvasState);
    }
  };

  const updateAndDeleteWoeker = useRef(new Worker(new URL('../../workers/WorkerForUpdateAndDeleteShapeCanvas.js', import.meta.url)));
  useEffect(() => {
    if (excalidrawAPIState) {

      const handleShapeAdded = (data) => {
        const prevSceneData = excalidrawAPIState.getSceneElements();
        const newElements = [...prevSceneData, data];
        excalidrawAPIState.updateScene({ elements: newElements });
      };

      const handleShapeUpdated = (data) => {
        const prevSceneData = excalidrawAPIState.getSceneElements();
        updateAndDeleteWoeker.current.postMessage({ type: 'update', data, prevSceneData });
        updateAndDeleteWoeker.current.onmessage = (e) => {
          excalidrawAPIState.updateScene({ elements: e.data });
        }

      }
      const handleDeleteShape = (data) => {
        const prevSceneData = excalidrawAPIState.getSceneElements();
        updateAndDeleteWoeker.current.postMessage({ type: 'delete', data, prevSceneData });
        updateAndDeleteWoeker.current.onmessage = (e) => {
          excalidrawAPIState.updateScene({ elements: e.data });
        }
      }

      socketState.on("shapeAdded", handleShapeAdded);
      socketState.on("shapeUpdated", handleShapeUpdated)
      socketState.on("shapeDeleted", handleDeleteShape)

      return () => {
        socketState.off("shapeAdded", handleShapeAdded);
        socketState.off("shapeUpdated", handleShapeUpdated);
        socketState.off("shapeDeleted", handleDeleteShape);

      };

    }
  }, [socketState, excalidrawAPIState]);

  const callToBackendToUpdateCanvasState = async (nature, element) => {
    socketState.emit(nature, {
      'shapes': element,
      'boardId': router.query.BoardUuid,
      'userId': getCookiesNext("userId"),
    })
  }

  return (
    <div className='w-full h-full'>
      <div className="w-full  h-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={37}>
            <RichTextEditor socketState={socketState} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={63}>
            <Excalidraw UIOptions={{
              tools: {
                image: false
              }
            }} renderTopRightUI={renderTopRightUI} excalidrawAPI={(e) => setexcalidrawAPIState(e)} onChange={handleChange} initialData={elementsState} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default SpecificBoardIndexConmponent