import CometChatApp from "./CometChat/CometChatApp";

const App = () => {
   return (
     /* CometChatApp requires a parent with explicit height & width to render correctly. 
     Adjust the height and width as needed.
     */
    <div style={{ width: "100vw", height: "100vh" }}>
      <CometChatApp />
    </div>
  );
};

export default App;