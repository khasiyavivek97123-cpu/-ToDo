import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { PageTransitionWrapper } from "@/components/layout/PageTransitionWrapper";
import { CelebrationModal } from "@/components/ui/CelebrationModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Area Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Fixed Topbar */}
        <Topbar />

        {/* Dedicated Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto flex flex-col pb-20 md:pb-6">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Task Detail Side Panel / Bottom Sheet */}
      <TaskDetailPanel />

      {/* Milestone Celebration Pop-up Modal */}
      <CelebrationModal />
    </div>
  );
}
