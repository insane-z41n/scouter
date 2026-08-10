import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable"
import PlayerTablePage from "../players/page"

export default function HomePage() {
  return (
    <div style={{height: "100vh"}}>
        <ResizablePanelGroup orientation="vertical" className="h-screen w-full">
        <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Header</span>
            </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={40}>
            <div>
                <PlayerTablePage/>
            </div>
        </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}
