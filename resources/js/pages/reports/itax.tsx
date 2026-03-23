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

export default function ReportItax() {
  const { t } = useTranslation();
  const { auth, users, reports, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];

  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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
  //   router.get(route('reports.itax'), {
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

    router.get(route('reports.itax'), params, { preserveState: true, preserveScroll: true });
  };

  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';

    router.get(route('reports.itax'), {
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

    router.get(route('reports.itax'), params, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setSelectedUser('all');
    setSearchTerm('');
    setShowFilters(false);

    router.get(route('reports.itax'), {
      page: 1,
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions: [] = [];


  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('HR Management'), href: route('reports.itax') },
    { title: t('Locations') }
  ];

  // Define table columns
  const columns = [
    {
      key: 'employee_id',
      label: t('Legacy ID')
    },
    {
      key: 'employee_id',
      label: t('Employee ID')
    },
    {
      key: 'name',
      label: t('Name')
    },
    {
      key: 'itax',
      label: t('I. Tax'),
      sortable: true
    },
    {
      key: 'surcharge',
      label: t('Surcharge'),
      // render: (value: string, row: any) => {
      //   const contact = [];
      //   if (row.phone) contact.push(row.phone);
      //   if (row.email) contact.push(row.email);

      //   return contact.join(' | ') || '-';
      // }
    },
    {
      key: 'cess',
      label: t('CESS'),
    },
    {
      key: 'total',
      label: t('Total'),
    },
  ];

  return (
    <PageTemplate
      title={t("I. Tax")}
      url="/reports/itax"
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
            router.get(route('reports.itax'), {
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
          data={reports?.data || []}
          from={reports?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={permissions}
        />

        {/* Pagination section */}
        <Pagination
          from={reports?.from || 0}
          to={reports?.to || 0}
          total={reports?.total || 0}
          links={reports?.links}
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