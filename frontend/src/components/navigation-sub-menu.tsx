import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FolderClosed, FolderOpen } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { len } from '@/utils/len';
import { hasAnyRole } from '@/api/auth';

type Item = {
  name: string;
  requiredRoles: string[];
  subItems: Array<{
    title: string;
    href: string;
    icon: any;
    requiredRoles: string[];
  }>;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const isCurrentPath = (path: string) => {
  return window.location.pathname === path;
};

interface SubMenuItemProps {
  index: number;
  item: Item;
  setCurrentlyOpen: (arg: number | null) => void;
  currentlyOpen: number | null;
}

function SubMenuItem({
  index,
  item,
  setCurrentlyOpen,
  currentlyOpen,
}: SubMenuItemProps) {
  const shouldOpen = currentlyOpen === index;
  const [shouldClose, setShouldClose] = useState<boolean>(true);

  function handleOnClick() {
    if (!shouldClose) {
      setCurrentlyOpen(null);
      setShouldClose(true);
      return;
    }

    setCurrentlyOpen(index);
    setShouldClose(false);
  }

  useEffect(() => {
    if (!shouldOpen) setShouldClose(true);
  }, [currentlyOpen]);

  return (
    <li key={index} className="p-2 cursor-pointer font-md font-semibold">
      <p
        onClick={handleOnClick}
        className="pb-2 flex justify-between items-center"
      >
        <div
          className={classNames(
            'flex items-center gap-2 hover:text-white',
            shouldOpen ? 'text-white' : 'text-white',
          )}
        >
          {shouldOpen ? (
            <FolderOpen className="w-5" />
          ) : (
            <FolderClosed className="w-5" />
          )}
          {item.name}
        </div>
        <ChevronDown
          className={classNames(
            'w-5',
            shouldOpen ? 'arrow-up text-white' : 'arrow-down text-white',
          )}
        />
      </p>
      <div
        className={classNames(
          'dash w-full bg-opacity-25',
          shouldOpen ? 'bg-white' : 'bg-gray-400',
        )}
      />
      {shouldOpen && (
        <ul>
          {len(item.subItems) &&
            item.subItems
              .filter((sb) => hasAnyRole(sb.requiredRoles))
              .map((subItem, subIndex) => (
                <li
                  key={subIndex}
                  className={classNames(subIndex === 0 ? 'mt-3' : '', 'ml-2')}
                >
                  <NavLink
                    to={subItem.href}
                    className={classNames(
                      isCurrentPath(subItem.href)
                        ? 'bg-gray-700 text-white'
                        : 'text-white hover:text-white hover:bg-gray-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                    )}
                  >
                    <subItem.icon
                      className={classNames(
                        isCurrentPath(subItem.href)
                          ? 'text-white'
                          : 'text-white group-hover:text-white',
                        'h-6 w-6 shrink-0',
                      )}
                      aria-hidden="true"
                    />

                    {subItem.title}
                  </NavLink>
                </li>
              ))}
        </ul>
      )}
    </li>
  );
}

function SubMenuNav({ navList }: { navList: Array<Item> }) {
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState<number | null>(null);

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navList
        .filter((f) => hasAnyRole(f.requiredRoles))
        .map((item, index) => (
          <SubMenuItem
            item={item}
            index={index}
            currentlyOpen={isCurrentlyOpen}
            setCurrentlyOpen={setIsCurrentlyOpen}
          />
        ))}
    </ul>
  );
}

export default SubMenuNav;
