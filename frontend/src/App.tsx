import './App.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import i18n from 'i18next';
import localization from './localization/localization.json';
import Layout from './layout';
import '../src/api';
import { initReactI18next } from 'react-i18next';
import FarmActivities from './pages/farm_activities';
import Login from './pages/auth/login';
import ProcessingActivities from './pages/processing_activities';
import Sales from './pages/sales';
import Expenses from './pages/expenses';
import Users from './pages/users';
import Harvesters from './pages/harvesters';
import LandParcels from './pages/land_parcels';
import ProcessingUnits from './pages/processing_units';
import Members from './pages/members';
import ContractedFarmers from './pages/contracted_farmers';
import Zones from './pages/zones';
import InventoryLocations from './pages/inventory_locations';
import MemberResources from './pages/resources';
import { ResourceType } from './api/types/user';
import { ProcessingType } from './api/types/processing_activity';
import { InventoryItemType } from './api/types/inventory';
import AdmissionInventory from './pages/inventory/admission';
import ProcessingInventory from './pages/inventory/processing';
import CleaningActivities from './pages/cleaning_activities';
import Admissions from './pages/admissions';
import Signup from './pages/auth/signup';
import Policy from './pages/auth/policy';
import MemberCrops from './pages/member_crops';
import { AdmissionType } from './api/types/admission';
import Admin from './pages/admin';
import AdminCodes from './pages/admin/codes';
import InputsInventory from './pages/inventory/inputs';
import AxiosErrorInterceptor from './components/axios-error-interceptor';
import { API_NAMES } from '@/api/types/code_category';
import { getUserLanguage } from './utils/user-language';
import NotFound from './pages/error';
import AdminDashboard from './pages/admin/dashboard';
import Dashboard from './pages/dashboard';

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/policy',
    element: <Policy />,
  },
  {
    path: '/admin/members',
    element: (
      <Layout>
        <Admin />
      </Layout>
    ),
  },
  {
    path: '/admin/crops',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.CROPS} />
      </Layout>
    ),
  },
  {
    path: '/admin/bma_crops',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.BMA_CROPS} />
      </Layout>
    ),
  },
  {
    path: '/admin/crop_parts',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.CROP_PARTS} />
      </Layout>
    ),
  },
  {
    path: '/admin/crop_diseases',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.CROP_DISEASES} />
      </Layout>
    ),
  },
  {
    path: '/admin/cultivation_activities',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.CULTIVATION_ACTIVITIES} />
      </Layout>
    ),
  },
  {
    path: '/admin/processing_methods',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.PROCESSING_METHODS} />
      </Layout>
    ),
  },
  {
    path: '/admin/processing_types',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.PROCESSING_TYPES} />
      </Layout>
    ),
  },
  {
    path: '/admin/bma_crop_parts',
    element: (
      <Layout>
        <AdminCodes type={API_NAMES.BMA_CROP_PARTS} />
      </Layout>
    ),
  },

  {
    path: '/collection_admissions',
    element: (
      <Layout>
        <Admissions
          type={AdmissionType.COLLECTION}
          key="collection_admissions"
        />
      </Layout>
    ),
  },
  {
    path: '/purchase_admissions',
    element: (
      <Layout>
        <Admissions type={AdmissionType.PURCHASE} key="purchase_admissions" />
      </Layout>
    ),
  },
  {
    path: '/collection_crop_list',
    element: (
      <Layout>
        <MemberCrops type={AdmissionType.COLLECTION} />
      </Layout>
    ),
  },
  {
    path: '/cultivation_crop_list',
    element: (
      <Layout>
        <MemberCrops type={AdmissionType.HARVESTING} />
      </Layout>
    ),
  },
  {
    path: '/processing_units',
    element: (
      <Layout>
        <ProcessingUnits />
      </Layout>
    ),
  },
  {
    path: '/farm_activities',
    element: (
      <Layout>
        <FarmActivities />
      </Layout>
    ),
  },
  {
    path: '/contracted-farmers',
    element: (
      <Layout>
        <ContractedFarmers />
      </Layout>
    ),
  },
  {
    path: '/planting-materials',
    element: (
      <Layout>
        <></>
      </Layout>
    ),
  },
  {
    path: '/waste',
    element: (
      <Layout>
        <></>
      </Layout>
    ),
  },
  {
    path: '/pesticides',
    element: (
      <Layout>
        <></>
      </Layout>
    ),
  },
  {
    path: '/members',
    element: (
      <Layout>
        <Members />
      </Layout>
    ),
  },
  {
    path: '/processing_activities',
    element: (
      <Layout>
        <ProcessingActivities />
      </Layout>
    ),
  },
  {
    path: '/drying_activities',
    element: (
      <Layout>
        <ProcessingActivities type={ProcessingType.DRYING} />
      </Layout>
    ),
  },
  {
    path: '/sales',
    element: (
      <Layout>
        <Sales />
      </Layout>
    ),
  },
  {
    path: '/expenses',
    element: (
      <Layout>
        <Expenses />
      </Layout>
    ),
  },
  {
    path: '/users',
    element: (
      <Layout>
        <Users />
      </Layout>
    ),
  },
  {
    path: '/harvesters',
    element: (
      <Layout>
        <Harvesters />
      </Layout>
    ),
  },
  {
    path: '/land_parcels',
    element: (
      <Layout>
        <LandParcels />
      </Layout>
    ),
  },
  {
    path: '/zones',
    element: (
      <Layout>
        <Zones />
      </Layout>
    ),
  },
  {
    path: '/machinery',
    element: (
      <Layout>
        <MemberResources
          resourceTypes={[
            ResourceType.FERTILIZATION_MACHINE,
            ResourceType.GRAZING_MACHINE,
            ResourceType.HARVESTING_MACHINE,
            ResourceType.PLOUGHING_MACHINE,
            ResourceType.SEED_PLANTING_MACHINE,
          ]}
        />
      </Layout>
    ),
  },
  {
    path: '/storage',
    element: (
      <Layout>
        <InventoryLocations />
      </Layout>
    ),
  },
  {
    path: '/harvesting_inventory',
    element: (
      <Layout>
        <AdmissionInventory
          type={InventoryItemType.HARVESTED_PRODUCT}
          key="harvesting_inventory"
        />
      </Layout>
    ),
  },
  {
    path: '/collection_inventory',
    element: (
      <Layout>
        <AdmissionInventory
          type={InventoryItemType.COLLECTED_PRODUCT}
          key="collection_inventory"
        />
      </Layout>
    ),
  },
  {
    path: '/processing_inventory',
    element: (
      <Layout>
        <ProcessingInventory
          type={InventoryItemType.PROCESSED_PRODUCT}
          key="processing_inventory"
        />
      </Layout>
    ),
  },
  {
    path: '/dried_inventory',
    element: (
      <Layout>
        <ProcessingInventory
          type={InventoryItemType.DRIED_PRODUCT}
          key="dried_inventory"
        />
      </Layout>
    ),
  },
  {
    path: '/inputs_inventory',
    element: (
      <Layout>
        <InputsInventory
          type={InventoryItemType.INPUT}
          key="inputs_inventory"
        />
      </Layout>
    ),
  },
  {
    path: '/planting_materials_inventory',
    element: (
      <Layout>
        <InputsInventory
          type={InventoryItemType.PLANTING_MATERIAL}
          key="plantnig_material_inventory"
        />
      </Layout>
    ),
  },
  {
    path: '/cleaning_activities',
    element: (
      <Layout>
        <CleaningActivities />
      </Layout>
    ),
  },
  {
    path: '/',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: '/admin',
    element: (
      <Layout>
        <AdminDashboard />
      </Layout>
    ),
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);

i18n.use(initReactI18next).init({
  resources: {
    ...localization,
  },
  lng: getUserLanguage(),
  supportedLngs: ['sq', 'en', 'sr'],
  fallbackLng: 'en',
});

function App() {
  return (
    <AxiosErrorInterceptor>
      <RouterProvider router={router} />
    </AxiosErrorInterceptor>
  );
}

export default App;
