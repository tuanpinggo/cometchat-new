// tuan_nguyen
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  UIKitSettingsBuilder,
  CometChatUIKit,
  CometChatLocalize,
  CalendarObject,
} from "@cometchat/chat-uikit-react";
import { setupLocalization } from "./CometChat/utils/utils";
import { CometChatProvider } from "./CometChat/context/CometChatContext";
import './index.css'
import Vi_vn from './CometChat/locales/vi/vi.json'
import En_us from './CometChat/locales/en-US/en-US.json'
export const COMETCHAT_CONSTANTS = {
  APP_ID: "277407a366096626", // Replace with your App ID
  REGION: "IN", // Replace with your App Region
  AUTH_KEY: "954d62cabad621386bdc540edcca1b6ad0fb5778", // Replace with your Auth Key or leave blank if you are authenticating using Auth Token
};

const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

CometChatUIKit.init(uiKitSettings)?.then(() => {
  setupLocalization();

  const UID = "cong-vu"; // Replace with your actual UID

  CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
    CometChatLocalize.init({
      language: "vi-VN",
      fallbackLanguage: "en-US",
      translationsForLanguage: {
        "vi-VN": Vi_vn,
        "en-US": En_us,
      },
      disableAutoDetection: false,
      disableDateTimeLocalization: false,
      timezone: "Asia/Ho_Chi_Minh",
      calendarObject: new CalendarObject({
        today: "[Hôm nay lúc] hh:mm A",
        yesterday: "[yesterday] hh:mm A",
        lastWeek: "[Tuần trước] dddd",
        otherDays: "DD MMM YYYY, hh:mm A",
        relativeTime: {
          minute: "%d phút trước",
          minutes: "%d phút trước",
          hour: "%d giờ trước",
          hours: "%d giờ trước",
        },
      }),
      missingKeyHandler: (key) => `🔍 Missing translation for: ${key}`,
    });
    if (!user) {
      CometChatUIKit.login(UID)
        .then((loggedUser: CometChat.User) => {
          console.log("Login Successful:", loggedUser);
          // Mount your app
          ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
            <CometChatProvider>
              <App />
            </CometChatProvider>
          );
        })
        .catch((error) => console.error("Login Failed:", error));
    } else {
      // User already logged in, mount app directly
      console.log("User already logged in:", user);
      ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <CometChatProvider>
          <App />
        </CometChatProvider>
      );
    }
  });
});