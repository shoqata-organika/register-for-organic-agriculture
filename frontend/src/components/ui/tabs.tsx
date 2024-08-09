import classNames from "@/utils/classNames";

interface Tab {
    id: string;
    name: string;
}
interface Props {
    tabs: Tab[];
    currentTab: Tab;
    onChange: (tab: Tab) => void;
}
function Tabs({ currentTab, tabs, onChange }: Props) {
    return <nav
        className="isolate flex divide-x divide-gray-200 rounded-lg shadow min-w-full"
        aria-label="Tabs"
    >
        {tabs.map((tab, index) => (
            <a
                className={classNames(
                    currentTab.id === tab.id
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700',
                    index === 0 ? 'rounded-l-lg' : '',
                    index === tabs.length - 1 ? 'rounded-r-lg' : '',
                    'cursor-pointer group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
                )}
                key={tab.id}
                onClick={() => onChange(tab)}
                aria-current={currentTab.id === tab.id ? 'page' : undefined}
            >
                <span>{tab.name}</span>
                <span
                    aria-hidden="true"
                    className={classNames(
                        currentTab.id === tab.id ? 'bg-gray-700' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5',
                    )}
                />
            </a>
        ))}
    </nav>
}

export default Tabs;