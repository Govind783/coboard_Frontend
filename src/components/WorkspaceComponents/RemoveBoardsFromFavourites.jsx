import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

const RemoveBoardToFavouritesModal = ({
    isOpen,
    setIsOpen,
    setUsersBoards,
    index,
    starAndUnstarBoardHandler,
    boardUuid,
  }) => {
    return (
      <AlertDialog open={isOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="">
              Remove this board to favourites? ✋
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this board from your favourites?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                starAndUnstarBoardHandler("unstarIt", boardUuid, setIsOpen);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default RemoveBoardToFavouritesModal