import { Link, Activity, Zap, X } from 'lucide-react';

interface SettingsModalProps {
    notionConfig: { botToken: string; databaseId: string; settingsOpen: boolean };
    setNotionConfig: React.Dispatch<React.SetStateAction<any>>;
    handleOAuthConnect: () => void;
}

const SettingsModal = ({ notionConfig, setNotionConfig, handleOAuthConnect }: SettingsModalProps) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={() => setNotionConfig((p: any) => ({ ...p, settingsOpen: false }))}>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                Notion Integration Settings
                <button onClick={() => setNotionConfig((p: any) => ({ ...p, settingsOpen: false }))} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </h2>

            <div className="space-y-6">
                {/* 1. Notion OAuth */}
                <div className="border p-4 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Link className="w-5 h-5 mr-2 text-blue-600" />
                        Notion Workspace Connection
                    </h3>
                    {notionConfig.botToken ? (
                        <p className="text-sm text-green-600 font-medium">
                            Status: Connected (Token Secured by simulated Backend).
                        </p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                Click below to start the OAuth 2.0 flow and securely connect your workspace. (Requires a backend.)
                            </p>
                            <button 
                                onClick={handleOAuthConnect}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Connect Notion with OAuth
                            </button>
                        </>
                    )}
                </div>
                
                {/* 2. Target Database */}
                <div className="border p-4 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-purple-600" />
                        Target Database for Saving Content
                    </h3>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notion Target Database ID</label>
                    <input
                        type="text"
                        value={notionConfig.databaseId}
                        onChange={(e) => setNotionConfig((p: any) => ({ ...p, databaseId: e.target.value }))}
                        placeholder="e4d6a... (UUID of your 'AI Content Library')"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        disabled={!notionConfig.botToken}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        This is where "Save to Notion" will push your chat responses.
                    </p>
                </div>

                {/* 3. Automation Rules */}
                <div className="border p-4 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                        Workflow Automation Rules
                    </h3>
                    <p className="text-sm text-gray-600">
                        Automation logic requires a backend worker system.
                    </p>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={() => setNotionConfig((p: any) => ({ ...p, settingsOpen: false }))} 
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                >
                    Close Configuration
                </button>
            </div>
        </div>
    </div>
);

export default SettingsModal;