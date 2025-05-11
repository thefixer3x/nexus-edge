import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, ListChecks, Settings, PlusCircle, ChevronLeft, ChevronRight, X, Info, Activity, Calendar, FileText, Layers } from 'lucide-react';

// --- Data Structures ---
interface Item {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
  overviewContent: React.ReactNode;
  items: Item[];
  settings: { [key: string]: any };
}

// --- Initial Data ---
const initialModules: Module[] = [
  {
    id: 'mod1',
    name: 'Project Alpha',
    icon: Layers,
    overviewContent: <div className="p-4 bg-gray-700 rounded-lg shadow">
                       <h3 className="text-lg font-semibold text-teal-300 mb-2">Alpha Overview</h3>
                       <p className="text-gray-300">This is the primary project focusing on core development. Currently in Phase 2.</p>
                       <div className="mt-3 flex space-x-2">
                           <span className="px-2 py-0.5 bg-teal-600 text-xs rounded-full">Development</span>
                           <span className="px-2 py-0.5 bg-blue-600 text-xs rounded-full">Frontend</span>
                       </div>
                     </div>,
    items: [
      { id: 'item1_1', name: 'Setup Initial Structure', description: 'Create the basic folder and file structure for the project.', status: 'completed', createdAt: new Date(Date.now() - 86400000 * 2) },
      { id: 'item1_2', name: 'Design API Endpoints', description: 'Define all necessary API endpoints and data schemas.', status: 'in-progress', createdAt: new Date(Date.now() - 86400000 * 1) },
    ],
    settings: { notifications: true, theme: 'dark', collaborators: ['Alice', 'Bob'] },
  },
  {
    id: 'mod2',
    name: 'Marketing Campaign',
    icon: Activity,
    overviewContent: <div className="p-4 bg-gray-700 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-pink-300 mb-2">Campaign Insights</h3>
                        <p className="text-gray-300">Upcoming Q3 marketing initiative. Focus on social media and content creation.</p>
                         <div className="mt-3 flex space-x-2">
                           <span className="px-2 py-0.5 bg-pink-600 text-xs rounded-full">Social Media</span>
                           <span className="px-2 py-0.5 bg-indigo-600 text-xs rounded-full">Content</span>
                       </div>
                      </div>,
    items: [
      { id: 'item2_1', name: 'Draft Social Media Calendar', description: 'Plan posts for the next month.', status: 'pending', createdAt: new Date() },
    ],
    settings: { budget: 5000, targetAudience: 'Tech Enthusiasts' },
  },
  {
    id: 'mod3',
    name: 'Knowledge Base',
    icon: FileText,
    overviewContent: <div className="p-4 bg-gray-700 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Documentation Central</h3>
                        <p className="text-gray-300">Repository for all internal and external documentation.</p>
                      </div>,
    items: [],
    settings: { accessLevel: 'internal', lastUpdatedBy: 'System' },
  },
];

// --- Main Component ---
const WorkspaceInterface = () => {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(initialModules[0]?.id || null);
  const [activeMiddleTab, setActiveMiddleTab] = useState<'overview' | 'items' | 'settings'>('overview');
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<Item | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const newItemInputRef = useRef<HTMLInputElement>(null);

  const activeModule = modules.find(m => m.id === activeModuleId);

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setActiveMiddleTab('overview'); // Reset to overview tab on module change
    setSelectedItemForDetails(null); // Clear details panel
    setRightPanelVisible(false);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !activeModuleId) return;

    const newItem: Item = {
      id: `item_${activeModuleId}_${Date.now()}`,
      name: newItemName,
      description: 'Newly added item, please add a description.',
      status: 'pending',
      createdAt: new Date(),
    };

    setModules(prevModules =>
      prevModules.map(mod =>
        mod.id === activeModuleId ? { ...mod, items: [...mod.items, newItem] } : mod
      )
    );
    setNewItemName('');
    newItemInputRef.current?.focus(); // Refocus for quick additions
  };

  const handleSelectItemForDetails = (item: Item) => {
    setSelectedItemForDetails(item);
    setRightPanelVisible(true);
  };

  // Effect to clear details if the selected item's module is no longer active or item deleted
  useEffect(() => {
    if (selectedItemForDetails && activeModule && !activeModule.items.find(i => i.id === selectedItemForDetails.id)) {
        setSelectedItemForDetails(null);
        setRightPanelVisible(false);
    }
  }, [modules, activeModuleId, selectedItemForDetails, activeModule]);


  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden"> {/* Prevent body scroll */}

      {/* ------------ Left Sidebar ------------ */}
      <div className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            W {/* Workspace Initial */}
          </div>
          <div>
            <h2 className="font-semibold text-lg">Workspace</h2>
            <div className="flex items-center text-xs text-gray-400">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-gray-700">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">Quick Stats</p>
            <div className="flex justify-between text-sm">
                <div className="text-center">
                    <div className="font-bold text-teal-400">{modules.reduce((acc, m) => acc + m.items.length, 0)}</div>
                    <div className="text-xs text-gray-400">Total Items</div>
                </div>
                 <div className="text-center">
                    <div className="font-bold text-blue-400">{modules.filter(m => m.items.some(i => i.status === 'in-progress')).length}</div>
                    <div className="text-xs text-gray-400">Active Modules</div>
                </div>
            </div>
        </div>

        <nav className="overflow-y-auto flex-1 px-3 py-2 space-y-1">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider pt-2 pb-1 px-1">Modules</p>
          {modules.map(module => (
            <button
              key={module.id}
              onClick={() => handleSelectModule(module.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 group
                ${ activeModuleId === module.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <module.icon size={18} className={activeModuleId === module.id ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
              <span>{module.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150">
            <Settings size={18} className="text-gray-400" />
            <span>Global Settings</span>
          </button>
        </div>
      </div>

      {/* ------------ Middle Section ------------ */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {activeModule ? (
          <>
            {/* Header and Tabs */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 flex items-center justify-between h-14 shrink-0">
              <div className="flex items-center">
                 <activeModule.icon size={20} className="mr-2 text-teal-400"/>
                 <h1 className="text-lg font-semibold text-gray-100">{activeModule.name}</h1>
              </div>
              <div className="flex h-full">
                {(['overview', 'items', 'settings'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveMiddleTab(tab)}
                    className={`px-3 sm:px-4 flex items-center border-b-2 font-medium text-sm capitalize transition-colors duration-150 h-full
                      ${ activeMiddleTab === tab
                          ? 'border-teal-500 text-teal-300'
                          : 'border-transparent text-gray-400 hover:text-gray-200'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeMiddleTab === 'overview' && activeModule.overviewContent}

              {activeMiddleTab === 'items' && (
                <div>
                  <form onSubmit={handleAddNewItem} className="mb-6 flex items-center gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow">
                    <PlusCircle size={20} className="text-teal-400 shrink-0" />
                    <input
                      ref={newItemInputRef}
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder={`Add a new item to ${activeModule.name}...`}
                      className="flex-1 py-2 px-3 text-sm bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-500 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500">
                      Add Item
                    </button>
                  </form>

                  {activeModule.items.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No items in this module yet. Add one above!</p>
                  ) : (
                    <ul className="space-y-3">
                      {activeModule.items.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).map(item => (
                        <li
                          key={item.id}
                          onClick={() => handleSelectItemForDetails(item)}
                          className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700 hover:border-teal-500 cursor-pointer transition-all duration-150 shadow hover:shadow-teal-500/20 flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-medium text-gray-100">{item.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{item.description.substring(0,60)}...</p>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    item.status === 'completed' ? 'bg-green-600 text-green-100' :
                                    item.status === 'in-progress' ? 'bg-yellow-600 text-yellow-100' :
                                    'bg-red-600 text-red-100'
                                }`}>
                                    {item.status.replace('-', ' ')}
                                </span>
                               <p className="text-xs text-gray-500 mt-1">{item.createdAt.toLocaleDateString()}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeMiddleTab === 'settings' && (
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4">{activeModule.name} Settings</h2>
                  <pre className="text-sm text-gray-300 bg-gray-700 p-3 rounded-md overflow-x-auto">
                    {JSON.stringify(activeModule.settings, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Layers size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-xl text-gray-500">No Module Selected</p>
              <p className="text-gray-600 mt-1">Please choose a module from the sidebar to begin.</p>
            </div>
          </div>
        )}
      </div>

      {/* ------------ Right Details Panel ------------ */}
      {/* Added transition and fixed width with shrink-0 */}
      <div className={`bg-gray-800 border-l border-gray-700 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${rightPanelVisible && activeModule ? 'w-80' : 'w-0'} overflow-hidden`}>
        {rightPanelVisible && activeModule && selectedItemForDetails && (
            <>
             <div className="p-4 border-b border-gray-700 flex justify-between items-center h-14 shrink-0">
                <div className="flex items-center">
                  <Info size={18} className="mr-2 text-teal-400" />
                  <h2 className="font-semibold text-base text-gray-100">Item Details</h2>
                </div>
                <button
                  onClick={() => setRightPanelVisible(false)}
                  className="rounded-full p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white"
                  title="Close details"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <h3 className="text-lg font-semibold text-teal-300">{selectedItemForDetails.name}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedItemForDetails.description}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
                    <div className="text-xs text-gray-400 flex justify-between"><span>Status:</span> <span className={`font-medium ${
                        selectedItemForDetails.status === 'completed' ? 'text-green-400' :
                        selectedItemForDetails.status === 'in-progress' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{selectedItemForDetails.status.replace('-', ' ')}</span></div>
                    <div className="text-xs text-gray-400 flex justify-between"><span>Created:</span> <span className="font-medium">{selectedItemForDetails.createdAt.toLocaleString()}</span></div>
                    <div className="text-xs text-gray-400 flex justify-between"><span>Module:</span> <span className="font-medium">{activeModule.name}</span></div>
                </div>

                 {/* Placeholder for more actions/details */}
                <button className="w-full mt-4 bg-teal-600 text-white py-2 rounded-md text-sm hover:bg-teal-500 transition-colors">
                    Edit Item (Not Implemented)
                </button>
              </div>
            </>
        )}
         {/* Show a prompt if panel is open but no