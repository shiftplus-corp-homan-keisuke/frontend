import Sidebar from "@/components/layout/Sidebar";
import EditorArea from "@/components/layout/EditorArea";
import TitleBar from "@/components/layout/TitleBar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TitleBar />
      <main className="flex-1 overflow-hidden bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize="280px" minSize="200px" maxSize="600px">
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize="300px">
            <EditorArea />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
