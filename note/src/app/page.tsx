import Sidebar from '@/components/layout/Sidebar';
import EditorArea from '@/components/layout/EditorArea';

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-row overflow-hidden bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <EditorArea />
      </div>
    </main>
  );
}
