// pages/hr/salary-register/index.tsx
import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
// import { hasPermission } from '@/utils/authorization';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';

export default function SalaryRegister() {
  const { t } = useTranslation();
  const { auth, users, salary_reports, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];

  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState(pageFilters.user || 'all');

  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedUser !== 'all' || searchTerm !== '';
  };

  // Count active filters
  const activeFilterCount = () => {
    return (selectedUser !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // const applyFilters = () => {
  //   router.get(route('reports.salary-register'), {
  //     page: 1,
  //     search: searchTerm || undefined,
  //     per_page: pageFilters.per_page
  //   }, { preserveState: true, preserveScroll: true });
  // };

  const applyFilters = () => {
    const params: any = { page: 1 };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (selectedUser !== 'all') {
      params.user = selectedUser;
    }

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('reports.salary-register'), params, { preserveState: true, preserveScroll: true });
  };

  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';

    router.get(route('reports.salary-register'), {
      sort_field: field,
      sort_direction: direction,
      page: 1,
      search: searchTerm || undefined,
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, item: any) => {
    console.log("test")
  };


  const handleUserFilter = (value: string) => {
    setSelectedUser(value);

    const params: any = { page: 1 };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (value !== 'all') {
      params.user = value;
    }

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('reports.salary-register'), params, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setSelectedUser('all');
    setSearchTerm('');
    setShowFilters(false);

    router.get(route('reports.salary-register'), {
      page: 1,
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions: [] = [];


  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('HR Management'), href: route('reports.salary-register') },
    { title: t('Locations') }
  ];

  // Define table columns
  const columns = [
    {
      key: 'employee_id',
      label: t('Employee ID')
    },
    {
      key: 'employee_id',
      label: t('Legacy ID')
    },
    {
      key: 'name',
      label: t('Employee'),
      render: (value: string, row: any) => {
        return row?.user?.name
      }
    },
    {
      key: 'date_of_joining',
      label: t('DOJ'),
      sortable: true
    },
    {
      key: 'date_of+birth',
      label: t('DOB'),
      // render: (value: string, row: any) => {
      //   const contact = [];
      //   if (row.phone) contact.push(row.phone);
      //   if (row.email) contact.push(row.email);

      //   return contact.join(' | ') || '-';
      // }
    },
    {
      key: 'designation',
      label: t('Designation'),
    },
    {
      key: 'department',
      label: t('Department'),
    },
    {
      key: 'location',
      label: t('Location'),
    },
    {
      key: 'cost_center',
      label: t('Cost Center'),
    },
    {
      key: 'bank_name',
      label: t('Bank Name'),
    },
    {
      key: 'bank_acc_no',
      label: t('Bank Acc No'),
    },
    {
      key: 'pan',
      label: t('PAN'),
    },
    {
      key: 'lop_days',
      label: t('LOP Days'),
    },
    {
      key: 'paid_days',
      label: t('Paid Days'),
    },
    {
      key: 'basic',
      label: t('Basic'),
    },
    {
      key: 'basic',
      label: t('Basic ARR'),
    },
    {
      key: 'hra',
      label: t('HRA'),
    },
    {
      key: 'hra',
      label: t('HRA ARR'),
    },
    {
      key: 'hra',
      label: t('Conv All'),
    },
    {
      key: 'hra',
      label: t('Conv Arr'),
    },
    {
      key: 'hra',
      label: t('Spl All'),
    },
    {
      key: 'hra',
      label: t('Spl All1'),
    },
    {
      key: 'hra',
      label: t('CCA'),
    },
    {
      key: 'hra',
      label: t('CCA ARR'),
    },
    {
      key: 'hra',
      label: t('Med'),
    },
    {
      key: 'hra',
      label: t('Arr Med'),
    },
    {
      key: 'hra',
      label: t('Stat Bonus'),
    },
    {
      key: 'hra',
      label: t('Arr Stat Bonus'),
    },
    {
      key: 'hra',
      label: t('Leave Encash'),
    },
    {
      key: 'hra',
      label: t('Gratuity'),
    },
    {
      key: 'hra',
      label: t('Notice Pay'),
    },
    {
      key: 'hra',
      label: t('OtherN/Birth Day Allowence'),
    },
    {
      key: 'hra',
      label: t('Sales Incentive'),
    },
    {
      key: 'hra',
      label: t('Exgratia'),
    },
    {
      key: 'hra',
      label: t('LTA'),
    },
    {
      key: 'hra',
      label: t('RSU'),
    },
    {
      key: 'hra',
      label: t('LTI Phantom'),
    },
    {
      key: 'hra',
      label: t('Dividend'),
    },
    {
      key: 'hra',
      label: t('Gross Total'),
    },
    {
      key: 'hra',
      label: t('Income Tax'),
    },
    {
      key: 'hra',
      label: t('PF'),
    },
    {
      key: 'hra',
      label: t('VPF'),
    },
    {
      key: 'hra',
      label: t('PTAX'),
    },
    {
      key: 'hra',
      label: t('ESI'),
    },
    {
      key: 'hra',
      label: t('ESI Wages'),
    },
    {
      key: 'hra',
      label: t('Loan Advance'),
    },
    {
      key: 'hra',
      label: t('Canteen'),
    },
    {
      key: 'hra',
      label: t('TPT DED'),
    },
    {
      key: 'hra',
      label: t('Mobile'),
    },
    {
      key: 'hra',
      label: t('Notice Recovery'),
    },
    {
      key: 'hra',
      label: t('LWF'),
    },
    {
      key: 'hra',
      label: t('House Loan'),
    },
    {
      key: 'hra',
      label: t('Personal Loan'),
    },
    {
      key: 'hra',
      label: t('Vehicle Loan'),
    },
    {
      key: 'hra',
      label: t('OtherD'),
    },
    {
      key: 'hra',
      label: t('Welfare Deduction'),
    },
    {
      key: 'hra',
      label: t('Gross Deduction'),
    },
    {
      key: 'hra',
      label: t('Net Salary'),
    },
    {
      key: 'hra',
      label: t('LType'),
    },
    // {
    //   key: 'created_at',
    //   label: t('Created At'),
    //   sortable: true,
    //   render: (value: string) => window.appSettings?.formatDateTime(value, false) || new Date(value).toLocaleDateString()
    // }
  ];

  return (
    <PageTemplate
      title={t("Salary Register")}
      url="/reports/salary-register"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {/* Search and filters section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={[
            {
              name: 'user',
              label: t('User'),
              type: 'select',
              value: selectedUser,
              onChange: handleUserFilter,
              options: [
                { value: 'all', label: t('All Users') },
                ...(users || []).map((user: any) => ({
                  value: user.id.toString(),
                  label: user.name
                }))
              ]
            }
          ]}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
          onApplyFilters={applyFilters}
          currentPerPage={pageFilters.per_page?.toString() || "10"}
          onPerPageChange={(value) => {
            router.get(route('reports.salary-register'), {
              page: 1,
              per_page: parseInt(value),
              search: searchTerm || undefined
            }, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={[]}
          data={salary_reports?.data || []}
          from={salary_reports?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={permissions}
        />

        {/* Pagination section */}
        <Pagination
          from={salary_reports?.from || 0}
          to={salary_reports?.to || 0}
          total={salary_reports?.total || 0}
          links={salary_reports?.links}
          entityName={t("locations")}
          onPageChange={(url) => router.get(url)}
        />
      </div>

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={(data) => {
          // Convert boolean to integer (Laravel expects 0/1 or true/false)
          data.welfare_status = data.welfare_status ? 1 : 0;

          // If OFF → remove dependent fields
          if (data.welfare_status === 0) {
            data.welfare_type = null;
            data.welfare_fund = null;
          }

          handleFormSubmit(data);
        }}
        formConfig={{
          fields: [
            { name: 'name', label: t('Location Name'), type: 'text', required: true },
            { name: 'address', label: t('Address'), type: 'textarea' },
            { name: 'city', label: t('City'), type: 'text' },
            { name: 'state', label: t('State/Province'), type: 'text' },
            { name: 'country', label: t('Country'), type: 'text' },
            { name: 'zip_code', label: t('ZIP/Postal Code'), type: 'text' },
            { name: 'professional_tax_rates', label: t('Professional Tax Rates'), type: 'text' },
            { name: 'welfare_status', label: t('Labour Welfare Fund status'), type: 'switch' },
            {
              name: 'welfare_type',
              label: t('Type'),
              type: 'select',
              options: [
                { value: 'fix', label: t('Fix') },
                { value: 'percent', label: t('Percent') }
              ],
              defaultValue: 'fix',
              conditional: (mode, data) => data?.welfare_status === true,
            },
            {
              name: 'welfare_fund', label: t('Labour Welfare Fund'), type: 'text',
              conditional: (mode, data) => data?.welfare_status === true,
            },
            { name: 'phone', label: t('Phone'), type: 'text' },
            { name: 'email', label: t('Email'), type: 'email' },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              options: [
                { value: 'active', label: t('Active') },
                { value: 'inactive', label: t('Inactive') }
              ],
              defaultValue: 'active'
            }
          ],
          modalSize: 'lg'
        }}
        initialData={currentItem}
        title={
          formMode === 'create'
            ? t('Add New Location')
            : formMode === 'edit'
              ? t('Edit Location')
              : t('View Location')
        }
        mode={formMode}
      />

      {/* Delete Modal */}
    </PageTemplate>
  );
}