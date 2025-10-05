import { CheckCircle, X } from 'lucide-react';

interface StatusToastProps {
    message: string | null;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const StatusToast = ({ message, type, onClose }: StatusToastProps) => {
    if (!message) return null;

    const Icon = type === 'success' ? CheckCircle : X;
    const color = type === 'success' ? 'bg-green-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl text-white ${color} flex items-center transition-all duration-300 transform`}>
            <Icon className="w-5 h-5 mr-2" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default StatusToast;