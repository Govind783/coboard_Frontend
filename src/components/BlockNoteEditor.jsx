"use client";
import React, { useEffect, useRef } from 'react';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import dynamic from "next/dynamic";
import { debounce, throttle } from 'lodash';
import { useRouter } from 'next/router';
// import { backendDomainHandler } from '@/generalConfig/BackendAndMiddlewareHelpers';
// import axios from 'axios';
// import { toast } from './ui/use-toast';
import { CustomSlashMenu } from './UI_Components/SlashMenuOptions';
import { backendDomainHandler } from '@/generalConfig/BackendAndMiddlewareHelpers';
import axios from 'axios';

const TextEditor = ({ socketState }) => {
  const isRemoteUpdate = useRef(false);
  const router = useRouter();
  const previousDataFetchRef = useRef(false);

  const editor = useCreateBlockNote({

    // 🌟🌟🌟 the code works great had to comment it out as my cloudinary bill was skyrocketing, feel free to uncomment it and use it by creating a new cloudinary account

    // uploadFile: async (file) => {
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   try {
    //     const response = await axios.post(`${backendDomainHandler()}/uploadImageForEditor`, formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });
    //     const imageUrl = response.data.url;
    //     handleImageUpload(imageUrl);
    //     return imageUrl;
    //   } catch (err) {
    //     console.log(err);
    //     toast({
    //       title: "Sorry the image could not be uploaded",
    //     })
    //     return "sorry could not upload image";
    //   }
    // }
  });
  // 🌟🌟🌟 uncomment and you can use the image upload code
  // const handleImageUpload = (imageUrl) => {
  //   if (imageUrl) {
  //     const editorState = editor.document;

  //     const lastIndex = editorState.reduceRight((lastIndex, current, index) => {
  //       return (lastIndex === -1 && current.type === "image") ? index : lastIndex;
  //     }, -1);

  //     let finalBlock = editorState[lastIndex];

  //     if (finalBlock) {
  //       finalBlock.props.url = imageUrl;
  //       finalBlock.props.width = 400;
  //       finalBlock.props.src = imageUrl;
  //       finalBlock.content = [{ type: 'image', text: imageUrl }];
  //       socketState.emit("editorUpdate", { 'editorData': finalBlock, "board_uuid": router.query.BoardUuid, 'blockIndex': lastIndex, 'createNewBlock': true });
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!router.isReady || !router.query.BoardUuid) return;

      try {
        const fromData = new FormData();
        fromData.append("board_uuid", router.query.BoardUuid);

        const response = await axios.post(`${backendDomainHandler()}/retrieveEditorData`, fromData, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
          console.error('Invalid response structure:', response.data);
          return;
        }

        const data = response.data.data;
        const document = editor.document;
        const sortedData = data.reverse()

        sortedData.forEach((blockData, index) => {
          // console.log('Block Data:', blockData);
          if (!blockData) {
            console.error('Invalid block data:', blockData);
            return; // Skip if blockData is missing
          }

          const newBlock = {
            id: blockData.id,
            children: blockData.children || [],
            content: blockData.content || [],
            props: blockData.props || {},
            type: blockData.type || 'unknown',
          };

          try {
            if (index === 0) {
              editor.insertBlocks([newBlock], null, 'after');
            } else {
              const referenceBlock = { id: document[index - 1]?.id || document[0]?.id };
              editor.insertBlocks([newBlock], referenceBlock, 'after');
            }
            // console.log('Inserted block:', newBlock);
          } catch (insertError) {
            console.error('Error inserting block:', insertError, 'Block Data:', newBlock);
          }
        });

        if (sortedData.length > 0) {
          try {
            editor.setTextCursorPosition(sortedData[0].id, "end");
          } catch (cursorError) {
            console.error('Error setting text cursor position:', cursorError);
          }
        }
        // console.log(editor.document);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        previousDataFetchRef.current = false;
      }
    };


    fetchInitialData();
  }, [router.isReady]);

  const emitEditorUpdate = (block, blockIndex) => {
    socketState.emit("editorUpdate", { 'editorData': block, "board_uuid": router.query.BoardUuid, 'blockIndex': blockIndex });
  };

  const throttledEmit = throttle((block, blockIndex) => {
    emitEditorUpdate(block, blockIndex);
  }, 200);

  const debouncedEmit = debounce((block, blockIndex) => {
    emitEditorUpdate(block, blockIndex);
  }, 1100);

  const finalONChangeHandler = () => {
    if (isRemoteUpdate.current || previousDataFetchRef.current) {
      isRemoteUpdate.current = false;
      return;
    }

    const block = editor.getTextCursorPosition().block;
    const document = editor.document;
    const blockIndex = document.findIndex(b => b.id === block.id);

    if (block.type !== "text") {
      if (block.content.length > 0 || Object.keys(block.content).length > 0) {
        throttledEmit(block, blockIndex);
        debouncedEmit(block, blockIndex);
        return;
      }
    }
    if (editor.document.length === 1) {
      socketState.emit("editorCleared", { "board_uuid": router.query.BoardUuid });
    }
  };

  useEffect(() => {
    socketState.on("editorUpdated", (data) => {
      // console.log(data);
      try {
        isRemoteUpdate.current = true;
        const newBlock = {
          id: data["editorData"].id,
          type: data["editorData"].type,
          props: data["editorData"].props,
          content: data["editorData"].content,
          children: data["editorData"].children,
        };

        const existingBlock = editor.getBlock(data["editorData"].id);
        const document = editor.document;
        const blockIndex = data.blockIndex;

        if (existingBlock) {
          editor.updateBlock(data["editorData"].id, newBlock);
        } else {
          if (data.createNewBlock) {
            console.log('for iomage trigger', blockIndex, document.length);
            console.log('image block', newBlock);
            if (blockIndex >= 0 && blockIndex < document.length) {
              editor.insertBlocks([newBlock], document[blockIndex].id, 'before');
              console.log('for iomage trigger', document[blockIndex].id, '|||', editor.document.length);
            } else {
              editor.insertBlocks([newBlock], document[document.length - 1]?.id || null, 'after');
            }
          } else {
            if (blockIndex === 0) {
              editor.insertBlocks([newBlock], document[0]?.id || null, 'before');
            } else {
              const previousBlockId = document[blockIndex - 1]?.id || null;
              if (previousBlockId) {
                editor.insertBlocks([newBlock], previousBlockId, 'after');
              } else {
                editor.insertBlocks([newBlock], document[document.length - 1]?.id || null, 'after');
              }
            }
          }
        }
        editor.setTextCursorPosition(newBlock.id || existingBlock.id, "end");
      } catch (error) {
        console.error("Error updating editor:", error);
      }
    });

    socketState.on("ClearedEditor", () => {
      try {
        isRemoteUpdate.current = true;
        const allblocks = editor.document.map(i => i.id);
        editor.removeBlocks(allblocks);
      } catch (error) {
        console.error("Error clearing editor:", error);
      }
    });

    // socketState.on("deletedImage", (data) => {
    //   console.log(data, 'data for backspace');
    //   try {
    //     isRemoteUpdate.current = true;
    //     editor.removeBlocks(data.blockId);
    //   } catch (error) {
    //     console.error("Error removing block:", error);
    //   }
    // });


    return () => {
      socketState.off("editorUpdated");
      socketState.off("ClearedEditor");
      // socketState.off("deletedImage");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'z' || e.key === 'y')) {
        console.log('event', e);
        e.preventDefault();
        e.stopPropagation()
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])
  

  return (
    <BlockNoteView
      editor={editor}
      onChange={finalONChangeHandler}
      formattingToolbar={false}
      imageToolbar={false}
      slashMenu={false}
    >
      <SuggestionMenuController
        triggerCharacter={"/"}
        suggestionMenuComponent={CustomSlashMenu}
      />
    </BlockNoteView>
  );
}

export default dynamic(() => Promise.resolve(TextEditor), {
  ssr: false
});
