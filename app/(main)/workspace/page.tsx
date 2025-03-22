import React from "react";
import AssistantList from "./_components/AssistantList";

function Workspace() {
  return (
    <div>
      <div className="grid grid-cols-5">
        <div className="hidden md:block">
          {/* Assistant list */} <AssistantList />
        </div>
        <div className="md:col-span-4 lg:col-span-3">Chat{/* Chat */}</div>
        <div className="hidden lg:block">
          Settings{/* Assistant Settings */}
        </div>
      </div>
    </div>
  );
}

export default Workspace;
