import { Fragment } from 'react';
import classNames from '@/utils/classNames';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { setUserLanguage } from '@/utils/user-language';
import { useTranslation } from 'react-i18next';
import { flagMap } from '@/common';
import { Menu, Transition } from '@headlessui/react';

export default function Flags({ border = true }: { border?: boolean }) {
  const { i18n } = useTranslation();

  return (
    <Menu
      as="div"
      className={`relative px-3 py-1 ${border ? 'border rounded' : ''}`}
    >
      <Menu.Button className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open language selector dropdown</span>
        <span className="hidden lg:flex lg:items-center">
          <div>
            <img
              src={`https://flagcdn.com/w20/${(flagMap as any)[i18n.language].flag}.png`}
              srcSet={`https://flagcdn.com/w40/${(flagMap as any)[i18n.language].flag}.png 2x`}
              alt="Albania"
            />
          </div>
          <ChevronDownIcon
            className="ml-2 h-5 w-5 text-gray-900"
            aria-hidden="true"
          />
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {['sq', 'en', 'sr'].map((lang) => (
            <Menu.Item key={lang}>
              <a
                href=""
                onClick={(evt) => {
                  i18n.changeLanguage(lang);
                  setUserLanguage(lang);
                  evt.preventDefault();
                }}
                className={classNames(
                  lang === i18n.language ? 'bg-gray-50' : '',
                  'block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50',
                )}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <img
                      src={`https://flagcdn.com/w20/${(flagMap as any)[lang].flag}.png`}
                      srcSet={`https://flagcdn.com/w40/${(flagMap as any)[lang].flag}.png 2x`}
                      alt="Albania"
                    />
                  </div>

                  {(flagMap as any)[lang].title || lang}
                </div>
              </a>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
