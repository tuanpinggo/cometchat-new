import { AppContext } from "@/CometChat/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CometChatGroups } from "@cometchat/chat-uikit-react";
import { useContext } from "react"
import { CometChat } from "@cometchat/chat-sdk-javascript";

async function urlToBlob(url: string) {
  const response = await fetch(url);
  return await response.blob();
}

export function ForwardMessageModal(){
    const { appState,setAppState } = useContext(AppContext);
    const handleForwardMessage = async (group: CometChat.Group) => {
        let newMessage;
        try {
            const originalMessage = appState.forwardMessageContent
            if(!originalMessage?.getData()) return
            const messageData = originalMessage.getData()
            const messateType = originalMessage?.getType()

            if(
                messateType === CometChat.MESSAGE_TYPE.IMAGE ||
                messateType === CometChat.MESSAGE_TYPE.AUDIO ||
                messateType === CometChat.MESSAGE_TYPE.VIDEO ||
                messateType === CometChat.MESSAGE_TYPE.FILE
            ){
                // const blob = await urlToBlob(messageData.url);
                // const file = new File([blob], messageData?.attachments?.[0]?.name || "media.jpg", {
                //     type: blob.type,
                // });
                // newMessage = new CometChat.sendMessage()
                // MediaMessage(
                //     group.getGuid(),
                //     originalMessage.getRawMessage(),
                //     messateType,
                //     CometChat.RECEIVER_TYPE.GROUP
                // )
            }

            if(messateType === CometChat.MESSAGE_TYPE.TEXT){
                newMessage = new CometChat.TextMessage(
                    group.getGuid(),
                    messageData.text,
                    CometChat.RECEIVER_TYPE.GROUP
                );
            }

            await CometChat.sendMessage(newMessage);
            setAppState({ type: 'UpdateShowForwardModal', payload:  !appState.showForwardModal})

        } catch (error) {
            console.log("🚀 ~ handleForwardMessage ~ error:", error)
            // alert("gui tin nhan loi")
        }
    }
    return(
       <Dialog open={appState.showForwardModal} onOpenChange={() => setAppState({ type: 'UpdateShowForwardModal', payload:  !appState.showForwardModal})}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chuyển tiếp tin nhắn</DialogTitle>
                    <DialogDescription className="hidden">
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogContent>
                    <div className="max-h-[600px] overflow-auto">
                        <CometChatGroups 
                            searchRequestBuilder={new CometChat.GroupsRequestBuilder()
                                .setLimit(8)
                            }
                            onItemClick={handleForwardMessage}
                        />
                    </div>
                </DialogContent>
            </DialogContent>
        </Dialog> 
    )
}