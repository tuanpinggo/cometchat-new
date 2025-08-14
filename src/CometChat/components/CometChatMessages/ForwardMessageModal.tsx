import { AppContext } from "@/CometChat/context/AppContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CometChatAvatar, CometChatGroups } from "@cometchat/chat-uikit-react";
import { useContext, useState } from "react"
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

const GetItemView = ({ group }: { group: CometChat.Group }) => {
    const { appState } = useContext(AppContext);
    const [loading, setLoading] = useState(false)
    const handleForwardMessage = async (group: CometChat.Group) => {
        setLoading(true)
        let newMessage;
        const currentUser = await CometChat.getLoggedInUser()
        const originalMessage = appState.forwardMessageContent
        if (!originalMessage?.getData()) return
        try {
            const messageData = originalMessage.getData()
            const messateType = originalMessage?.getType()
            if (
                messateType === CometChat.MESSAGE_TYPE.IMAGE ||
                messateType === CometChat.MESSAGE_TYPE.AUDIO ||
                messateType === CometChat.MESSAGE_TYPE.VIDEO ||
                messateType === CometChat.MESSAGE_TYPE.FILE
            ) {
                newMessage = new CometChat.MediaMessage(
                    group.getGuid(),
                    "",
                    messateType,
                    CometChat.RECEIVER_TYPE.GROUP
                )
                const attachment = new CometChat.Attachment(messageData.attachments[0]);
                newMessage.setAttachment(attachment)
            }

            if (messateType === CometChat.MESSAGE_TYPE.TEXT) {
                newMessage = new CometChat.TextMessage(
                    group.getGuid(),
                    messageData.text,
                    CometChat.RECEIVER_TYPE.GROUP
                );
            }

            newMessage?.setMetadata({
                forwarded: true,
                forwardedAt: new Date().getTime(),
                forwardedBy: currentUser.name,
                originalMessageId: originalMessage.getId(),
                originalSender: originalMessage.getSender().getName()
            })

            await CometChat.sendMessage(newMessage);

            // setAppState({ type: 'UpdateShowForwardModal', payload: !appState.showForwardModal })

        } catch (error) {
            console.log("🚀 ~ handleForwardMessage ~ error:", error)
        }
        setLoading(false)
    }

    return (
        <div className="inline-flex justify-between items-center p-3">
            <div className="inline-flex items-center gap-3">
                <div>
                    <CometChatAvatar
                        image={group?.getIcon()}
                        name={group?.getName()}
                    />
                </div>
                <div className="flex flex-col gap-0">
                    <div className="font-semibold">{group.getName()}</div>
                    <div className="text-sm">{group.getMembersCount()} Members</div>
                </div>
            </div>
            <div className="group-list-item__title-wrapper">
                <Button
                    size={"sm"}
                    variant={"secondary"}
                    onClick={() => handleForwardMessage(group)}
                    disabled={loading}
                >
                    {loading && <Loader2Icon className="animate-spin" />}
                    <span className="text-[12px]">Chuyển tiếp</span>
                </Button>
            </div>
        </div>
    );
};

export function ForwardMessageModal() {
    const { appState, setAppState } = useContext(AppContext);

    const itemViewWrapper = (group: CometChat.Group) => {
        return <GetItemView group={group} />;
    };

    return (
        <Dialog open={appState.showForwardModal} onOpenChange={() => setAppState({ type: 'UpdateShowForwardModal', payload: !appState.showForwardModal })}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chuyển tiếp tin nhắn</DialogTitle>
                    <DialogDescription className="hidden">
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogContent className="max-h-[600px] overflow-y-scroll p-0">
                    <CometChatGroups
                        searchRequestBuilder={new CometChat.GroupsRequestBuilder()
                            .setLimit(30)
                        }
                        // onItemClick={handleForwardMessage}
                        showScrollbar={true}
                        itemView={itemViewWrapper}
                    />
                </DialogContent>
            </DialogContent>
        </Dialog>
    )
}