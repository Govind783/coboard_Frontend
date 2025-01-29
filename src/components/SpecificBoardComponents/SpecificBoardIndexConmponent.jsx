"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";
import { getCookiesNext } from "@/cookies/cookiesConfig";
import CallingComponent from "../Calling/Index";
import { CgSpinner } from "react-icons/cg";
import { debounce } from "lodash";
import axios from "axios";
import { backendDomainHandler } from "@/generalConfig/BackendAndMiddlewareHelpers";
import { toast } from "../ui/use-toast";
const RichTextEditor = dynamic(() => import("@/components/BlockNoteEditor"), { ssr: false });
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="flex items-center gap-4">
        <CgSpinner className="animate-spin h-12 w-12 text-4xl" />
        <p className="linear-wipe" style={{ color: "#a4a0a0" }}>
          Setting up Canvas...
        </p>
      </div>
    </div>
  ),
});

const socketState = io(backendDomainHandler(), {
  query: {
    user_id: getCookiesNext("userId"),
  },
});

const SpecificBoardIndexConmponent = () => {
  const router = useRouter();
  const [excalidrawAPIState, setexcalidrawAPIState] = useState(null);
  const initialLoad = useRef(true);
  const [isSaving, setIsSaving] = useState(false);  // Start with false to show green
  const [boardTeamMembers, setBoardTeamMembers] = useState([]);
  const timerID = useRef(null);

  const toggleSaveStatusIndicator = () => {
    setIsSaving(true);
    if (timerID.current) clearTimeout(timerID.current);
    timerID.current = setTimeout(() => {
        setIsSaving(false);
    }, 5000);
};
console.log(isSaving, 'sss');

  useEffect(() => {
    if (router.isReady) {
      socketState.emit("readyToUseApp", { boardUuid: router.query.BoardUuid });
      return () => {
        socketState.off("readyToUseApp");
      };
    }
  }, [router.isReady]);

  const workerRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!router.isReady || !excalidrawAPIState || typeof window === "undefined") return;
      workerRef.current = new Worker(new URL("../../workers/WorkerForCanvasState.js", import.meta.url));

      workerRef.current.postMessage({ board_uuid: router.query.BoardUuid, backendDomain: backendDomainHandler() });

      workerRef.current.onmessage = function (e) {
        if (!e.data) return;
        const previousCanvasState = e?.data;

        if (previousCanvasState.length > 0) {
          const workerForCanvasSceneDifference = new Worker(
            new URL("../../workers/WorkerForCanvasSceneDifference.js", import.meta.url)
          );

          workerForCanvasSceneDifference.postMessage({
            currentElements: excalidrawAPIState.getSceneElements(),
            newElements: previousCanvasState,
            versionsMap,
          });

          workerForCanvasSceneDifference.onmessage = (e) => {
            const { added, updated } = e.data;
            if (added.length > 0 || updated.length > 0) {
              excalidrawAPIState.updateScene({ elements: [...added, ...updated] });
              [...added, ...updated].forEach((el) => versionsMap.set(el.id, el.version));
            }
            initialLoad.current = false;
          };

          initialLoad.current = false;
        } else {
          initialLoad.current = false;
        }
      };
    })();
  }, [router.isReady, excalidrawAPIState]);

  const renderTopRightUI = () => {
    return (
      <>
        {sessionStorage.getItem("isBoardShared") !== "false" && (
          <CallingComponent teamMembers={boardTeamMembers} socket={socketState} />
        )}
      </>
    );
  };

  useEffect(() => {
    if (sessionStorage.getItem("isBoardShared") !== "false" && router.query.BoardUuid) {
      (async () => {
        const formData = new FormData();
        formData.append("board_uuid", router.query.BoardUuid);
        try {
          const teamMembers = await axios.post(`${backendDomainHandler()}/retrieveTeamMembers`, formData, {
            headers: { "Content-Type": "application/json" },
          });
          if (teamMembers.data.data?.length > 0) {
            setBoardTeamMembers(teamMembers.data.data);
          }
        } catch (err) {
          console.error(err);
          toast({
            title: "Oops! There was an error in loading your team members",
            variant: "destructive",
          });
        }
      })();
    }
  }, [router.isReady]);

  const versionsMap = useRef(new Map()).current;
  const [elementsState, setElementsState] = useState({
    elements: [],
  });

  const canvasOnChangeHandler = debounce(
    (allElements, setElementsState, versionsMap, callToBackendToUpdateCanvasState) => {
      console.log('in debounceeeeee log');
      
      // const newIds = new Set(allElements.map(el => el.id));
      const elementsChanged = new Set();
      
      allElements.forEach((element) => {
        const storedVersion = versionsMap.get(element.id) || 0;
        if (!versionsMap.has(element.id)) {
          callToBackendToUpdateCanvasState("addShape", element);
          elementsChanged.add(element.id);
        } else if (element.version > storedVersion && !element.isDeleted) {
          callToBackendToUpdateCanvasState("updateShape", element);
          elementsChanged.add(element.id);
        } else if (element.version > storedVersion && element.isDeleted) {
          callToBackendToUpdateCanvasState("deleteShape", { id: element.id });
          versionsMap.delete(element.id);
          elementsChanged.add(element.id);
        }
        versionsMap.set(element.id, element.version);
      });

      if (elementsChanged.size > 0) {
        setElementsState({ elements: allElements });
      }
    },
    1100
  );

  const handleChange = (elements, appState) => {
    if (initialLoad.current) return;
    console.log('outside if');
    
    // Check if there are actually any selected elements
    const hasSelectedElements = appState.selectedElementIds && Object.keys(appState.selectedElementIds).length > 0;
    
    if (
      appState.draggingElement !== null ||
      appState.resizingElement !== null ||
      appState.editingElement !== null ||
      appState.pointerButtonDown ||
      hasSelectedElements
    ) {
      console.log('inside if');
      
      toggleSaveStatusIndicator()
      canvasOnChangeHandler(elements, setElementsState, versionsMap, callToBackendToUpdateCanvasState);
    }
  };

  const updateAndDeleteWoeker = useRef();
  useEffect(() => {
    if (excalidrawAPIState) {
      updateAndDeleteWoeker.current = new Worker(
        new URL("../../workers/WorkerForUpdateAndDeleteShapeCanvas.js", import.meta.url)
      );

      const handleShapeAdded = (data) => {
        const prevSceneData = excalidrawAPIState.getSceneElements();
        const newElements = [...prevSceneData, data];
        excalidrawAPIState.updateScene({ elements: newElements });
      };

      const handleShapeUpdated = (data) => {
        const prevSceneData = excalidrawAPIState.getSceneElements();
        updateAndDeleteWoeker.current.postMessage({ type: "update", data, prevSceneData });
        updateAndDeleteWoeker.current.onmessage = (e) => {
          excalidrawAPIState.updateScene({ elements: e.data });
        };
      };
      const handleDeleteShape = (data) => {
        const prevSceneData = excalidrawAPIState.getSceneElements();
        updateAndDeleteWoeker.current.postMessage({ type: "delete", data, prevSceneData });
        updateAndDeleteWoeker.current.onmessage = (e) => {
          excalidrawAPIState.updateScene({ elements: e.data });
        };
      };

      socketState.on("shapeAdded", handleShapeAdded);
      socketState.on("shapeUpdated", handleShapeUpdated);
      socketState.on("shapeDeleted", handleDeleteShape);

      return () => {
        socketState.off("shapeAdded", handleShapeAdded);
        socketState.off("shapeUpdated", handleShapeUpdated);
        socketState.off("shapeDeleted", handleDeleteShape);
      };
    }
  }, [socketState, excalidrawAPIState]);

  const callToBackendToUpdateCanvasState = async (nature, element) => {
    socketState.emit(nature, {
      shapes: element,
      boardId: router.query.BoardUuid,
      userId: getCookiesNext("userId"),
    });
  };

  return (
    <div className="w-full h-full">
      <div className="w-full  h-full">
        <div className="fixed -bottom-2 -left-4">
          <StatusIndicators isSaving={isSaving} />
        </div>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={37}>
            <RichTextEditor socketState={socketState} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={63}>
            <Excalidraw
              UIOptions={{
                tools: {
                  image: false,
                },
              }}
              renderTopRightUI={renderTopRightUI}
              excalidrawAPI={(e) => setexcalidrawAPIState(e)}
              onChange={handleChange}
              initialData={elementsState}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SpecificBoardIndexConmponent;

const StatusIndicators = memo(({ isSaving }) => {
  return (
    <div className="flex flex-col space-y-4 p-8 bg-gray-900">
      {/* Saved Status */}
      {!isSaving ? (
        <div className="flex items-center space-x-2 bg-green-900/20 rounded-full px-4 py-2 w-fit">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div
              className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"
              style={{ animationDuration: "3s" }}
            ></div>
          </div>
          <span className="text-green-400 font-medium">Changes saved</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 bg-red-900/20 rounded-full px-4 py-2 w-fit">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div
              className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"
              style={{ animationDuration: "3s" }}
            ></div>
          </div>
          <span className="text-red-400 font-medium">saving changes in 5s</span>
        </div>
      )}
    </div>
  );
});
StatusIndicators.displayName = "StatusIndicators";
