import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash2, Upload, Download } from 'lucide-react';

export default function EmployeeCreate() {
  const { t } = useTranslation();
  // State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();

    if (bulkFile) {
      submitData.append('bulk_file', bulkFile);
    }

    // Submit the form
    router.post(route('hr.employees.bulkStore'), submitData, {
      forceFormData: true,
      onSuccess: (page) => {
        setIsSubmitting(false);
        if (page.props.flash.success) {
          toast.success(t(page.props.flash.success));
        }
        router.get(route('hr.employees.index'));
      },
      onError: (errors) => {
        setIsSubmitting(false);
        setErrors(errors);

        toast.error(t('Please correct the errors in the form'));
      }
    });
  };



  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('HR Management'), href: route('hr.employees.index') },
    { title: t('Employees'), href: route('hr.employees.index') },
    { title: t('Upload Employee') }
  ];

  return (
    <PageTemplate
      title={t("Upload Employee")}
      url="/hr/employees/create-bulk"
      breadcrumbs={breadcrumbs}
      actions={[
        {
          label: t('Back to Employees'),
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
          variant: 'outline',
          onClick: () => router.get(route('hr.employees.index'))
        }
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader className="flex items-start justify-between">
            {/* <CardTitle>{t('Bulk Employee Upload')}</CardTitle> */}
            <div className="flex items-center space-x-2">
              <input
                id="bulk_file"
                type="file"
                accept=",.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBulkFile(e.target.files[0]);
                    if (errors['bulk_file']) {
                      setErrors(prev => { const n = { ...prev }; delete n['bulk_file']; return n; });
                    }
                  }
                }}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => (document.getElementById('bulk_file') as HTMLInputElement | null)?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {t('Upload')}
              </Button>
              <Button type="button" variant="outline" onClick={() => { (globalThis as any).location.href = '/samples/bulk_employees_sample.csv'; }}>
                <Download className="h-4 w-4 mr-2" />
                {t('Download Sample')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* <Label>{t('Bulk File')}</Label>
                          <p className="text-sm text-gray-500">{bulkFile ? bulkFile.name : t('Use the upload button on the top-right to select a CSV/Excel file')}</p> */}
                {bulkFile && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm">{bulkFile.name}</p>
                    <button
                      type="button"
                      onClick={() => setBulkFile(null)}
                      className="text-red-500 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {errors.bulk_file && <p className="text-red-500 text-xs">{errors.bulk_file}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.get(route('hr.employees.index'))}
          >
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('Saving...') : t('Import Employee')}
          </Button>
        </div>
      </form>
    </PageTemplate>
  );
}