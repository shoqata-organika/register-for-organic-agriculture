import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  FolderIcon,
  LockClosedIcon,
  MapIcon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Tractor,
  LandPlot,
  StickyNote,
  Eraser,
  Receipt,
  Wallet,
  BookUser,
  Folder,
} from 'lucide-react';
import SubMenuNav from '@/components/navigation-sub-menu';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { User } from '@/api/types/user';
import { hasAnyRole, logOut } from '@/api/auth';
import { getMe } from '@/api/user';
import { NavLink } from 'react-router-dom';
import { UserContext } from './context';
import { QueryClient, QueryClientProvider } from 'react-query';
import classNames from '@/utils/classNames';
import Flags from '@/components/flags';

interface Props {
  children: any;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function isCurrentPath(path: string) {
  return window.location.pathname === path;
}

function isAdminPage() {
  return window.location.pathname.indexOf('/admin') === 0;
}

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const isAdmin = isAdminPage();
  const { t } = useTranslation();

  useEffect(() => {
    getMe()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate('/login');
        }
      });
  }, []);

  const adminNavigation = [
    {
      name: t('Dashboard'),
      href: '/admin',
      icon: UserIcon,
    },
    {
      name: t('List of Members'),
      href: '/admin/members',
      icon: BookUser,
    },
    {
      name: t('Crops (PPJD)'),
      href: '/admin/crops',
      icon: Folder,
    },
    {
      name: t('Crop Parts (PPJD)'),
      href: '/admin/crop_parts',
      icon: Folder,
    },
    {
      name: t('Crops (BMA)'),
      href: '/admin/bma_crops',
      icon: Folder,
    },
    {
      name: t('Crop Parts (BMA)'),
      href: '/admin/bma_crop_parts',
      icon: Folder,
    },
    {
      name: t('Crops Diseases'),
      href: '/admin/crop_diseases',
      icon: Folder,
    },
    {
      name: t('Cultivation Activities'),
      href: '/admin/cultivation_activities',
      icon: Folder,
    },
    {
      name: t('Processing Methods'),
      href: '/admin/processing_methods',
      icon: Folder,
    },
    {
      name: t('Processing Types'),
      href: '/admin/processing_types',
      icon: Folder,
    },
  ];

  const navigation = [
    {
      name: t('Cultivation'),
      requiredRoles: [
        'member_admin',
        'read_parcels',
        'read_farm_activities',
        'read_contracted_farmers',
        'read_member_crops',
      ],
      subItems: [
        {
          title: t('Land Parcels'),
          href: '/land_parcels',
          icon: LandPlot,
          requiredRoles: ['member_admin', 'read_parcels'],
        },
        {
          title: t('Farm Activities'),
          href: '/farm_activities',
          icon: Tractor,
          requiredRoles: ['member_admin', 'read_farm_activities'],
        },
        {
          title: t('Contracted Farmers'),
          href: '/contracted-farmers',
          icon: MapIcon,
          requiredRoles: ['member_admin', 'read_contracted_farmers'],
        },
        {
          title: t('Crop List'),
          href: '/cultivation_crop_list',
          icon: StickyNote,
          requiredRoles: ['member_admin', 'read_member_crops'],
        },
        {
          title: t('Admissions from Farmers'),
          href: '/purchase_admissions',
          icon: StickyNote,
          requiredRoles: ['member_admin', 'read_member_crops'],
        },
      ],
    },
    {
      name: t('Collections'),
      requiredRoles: [
        'member_admin',
        'read_zones',
        'read_harvesters',
        'read_member_crops',
        'read_collection_admissions',
      ],
      subItems: [
        {
          title: t('Zones'),
          href: '/zones',
          icon: MapIcon,
          requiredRoles: ['member_admin', 'read_zones'],
        },
        {
          title: t('Harvesters'),
          href: '/harvesters',
          icon: UserIcon,
          requiredRoles: ['member_admin', 'read_harvesters'],
        },
        {
          title: t('Crop List'),
          href: '/collection_crop_list',
          icon: StickyNote,
          requiredRoles: ['member_admin', 'read_member_crops'],
        },
        {
          title: t('Admissions'),
          href: '/collection_admissions',
          icon: StickyNote,
          requiredRoles: ['member_admin', 'read_collection_admissions'],
        },
      ],
    },
    {
      name: t('Processing'),
      requiredRoles: [
        'member_admin',
        'read_processing_units',
        'read_drying',
        'read_processing',
        'read_cleaning_activities',
      ],
      subItems: [
        {
          title: t('Processing Units'),
          href: '/processing_units',
          icon: UserIcon,
          requiredRoles: ['member_admin', 'read_processing_units'],
        },
        {
          title: t('Drying Activities'),
          href: '/drying_activities',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_drying'],
        },
        {
          title: t('Processing Activities'),
          href: '/processing_activities',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_processing'],
        },
        {
          title: t('Pastrimi'),
          href: '/cleaning_activities',
          icon: Eraser,
          requiredRoles: ['member_admin', 'read_cleaning_activities'],
        },
      ],
    },
    {
      name: t('Inventory'),
      requiredRoles: [
        'member_admin',
        'read_inventory_locations',
        'read_inventory_items',
      ],
      subItems: [
        {
          title: t('Storage'),
          href: '/storage',
          icon: MapIcon,
          requiredRoles: ['member_admin', 'read_inventory_locations'],
        },
        {
          title: t('Harvesting Inventory'),
          href: '/harvesting_inventory',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_inventory_items'],
        },
        {
          title: t('Collection Inventory'),
          href: '/collection_inventory',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_inventory_items'],
        },
        {
          title: t('Dried Inventory'),
          href: '/dried_inventory',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_inventory_items'],
        },
        {
          title: t('Processing Inventory'),
          href: '/processing_inventory',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_inventory_items'],
        },
        {
          title: t('Inputs'),
          href: '/inputs_inventory',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_inventory_items'],
        },
        {
          title: t('Planting Materials'),
          href: '/planting_materials_inventory',
          icon: FolderIcon,
          requiredRoles: ['member_admin', 'read_inventory_items'],
        },
      ],
    },
    {
      name: t('Accounting'),
      icon: Receipt,
      requiredRoles: ['member_admin', 'read_sales', 'read_expenses'],
      subItems: [
        {
          title: t('Sales'),
          href: '/sales',
          icon: Receipt,
          requiredRoles: ['member_admin', 'read_sales'],
        },
        {
          title: t('Expenses'),
          href: '/expenses',
          icon: Wallet,
          requiredRoles: ['member_admin', 'read_expenses'],
        },
      ],
    },
  ];

  const topNavigation = [
    {
      name: t('Profile'),
      href: '/members',
      icon: UserCircleIcon,
      requiredRoles: ['member_admin', 'read_member_profile'],
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={currentUser}>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-800/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            stroke={sidebarOpen ? 'white' : 'black'}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4">
                      <div className="flex h-16 shrink-0 items-center">
                        <NavLink to="/">
                          <img
                            className="h-8 w-auto"
                            src={`${process.env.PUBLIC_URL}/logo.png`}
                            alt="Organika ORMS"
                          />
                        </NavLink>
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li className="mb-4">
                            <ul role="list" className="-mx-2 space-y-1">
                              {(isAdmin
                                ? adminNavigation
                                : topNavigation.filter((n) =>
                                    hasAnyRole(n.requiredRoles),
                                  )
                              ).map((item) => (
                                <li key={item.name}>
                                  <NavLink
                                    to={item.href}
                                    className={classNames(
                                      isCurrentPath(item.href)
                                        ? 'bg-gray-700 text-white'
                                        : 'text-white hover:text-white hover:bg-gray-700',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        isCurrentPath(item.href)
                                          ? 'text-white'
                                          : 'text-white group-hover:text-white',
                                        'h-6 w-6 shrink-0',
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                          {!isAdmin && (
                            <li>
                              <SubMenuNav navList={navigation} />
                            </li>
                          )}
                          {!isAdmin &&
                            hasAnyRole(['member_admin', 'read_users']) && (
                              <li className="mt-auto">
                                <NavLink
                                  to="/users"
                                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-gray-700 hover:text-white"
                                >
                                  <UserCircleIcon
                                    className="h-6 w-6 shrink-0 text-white group-hover:text-white"
                                    aria-hidden="true"
                                  />
                                  {t('Users')}
                                </NavLink>
                              </li>
                            )}
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-800 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <NavLink to="/">
                  <img
                    className="h-8 w-auto"
                    src={`${process.env.PUBLIC_URL}/logo.png`}
                    alt="Organika ORMS"
                  />
                </NavLink>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {(isAdmin
                        ? adminNavigation
                        : topNavigation.filter((n) =>
                            hasAnyRole(n.requiredRoles),
                          )
                      ).map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            className={classNames(
                              isCurrentPath(item.href)
                                ? 'bg-gray-700 text-white'
                                : 'text-white hover:text-white hover:bg-gray-700',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            )}
                          >
                            <item.icon
                              className={classNames(
                                isCurrentPath(item.href)
                                  ? 'text-white'
                                  : 'text-white group-hover:text-white',
                                'h-6 w-6 shrink-0',
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {!isAdmin && (
                    <li>
                      <SubMenuNav navList={navigation} />
                    </li>
                  )}
                  <li className="mt-auto">
                    {!isAdmin && hasAnyRole(['member_admin', 'read_users']) && (
                      <NavLink
                        to="/users"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-gray-700 hover:text-white"
                      >
                        <UserCircleIcon
                          className="h-6 w-6 shrink-0 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                        {t('Users')}
                      </NavLink>
                    )}
                  </li>
                  <li>
                    <a
                      href=""
                      onClick={() => {
                        logOut();
                        window.location.reload();
                      }}
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-gray-700 hover:text-white"
                    >
                      <LockClosedIcon
                        className="h-6 w-6 shrink-0 text-white group-hover:text-white"
                        aria-hidden="true"
                      />
                      {t('Logout')}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-white lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon
                  className="h-6 w-6"
                  aria-hidden="true"
                  stroke="black"
                />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-white"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-white focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                    name="search"
                  />
                </form>
                <div className="flex items-center gap-x-2 lg:gap-x-4">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-white hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                    aria-hidden="true"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      {/* <img
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      /> */}
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="text-sm font-semibold leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          {currentUser && currentUser.member && (
                            <>
                              {currentUser.first_name} {currentUser.last_name} (
                              {currentUser.member.business_name})
                            </>
                          )}

                          {currentUser && !currentUser.member && (
                            <>
                              {currentUser.first_name} {currentUser.last_name}
                            </>
                          )}
                        </span>
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
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href=""
                              onClick={() => {
                                logOut();
                                window.location.reload();
                              }}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900',
                              )}
                            >
                              {t('Logout')}
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/* Language Dropdown */}
                  <Flags border={false} />
                </div>
              </div>
            </div>

            <main className="py-5">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
