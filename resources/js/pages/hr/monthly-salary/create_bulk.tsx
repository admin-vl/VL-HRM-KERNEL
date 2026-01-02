import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash2, Upload, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getMonths } from '@/constants/month';

export default function MonthlySalarySettlementCreate() {
  const { t } = useTranslation();
  const { years } = usePage().props as any;

  // State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({
    year: '',
    month: ''
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    if (bulkFile) {
      submitData.append('bulk_file', bulkFile);
    }
    submitData.append('year', formData.year)
    submitData.append('month', formData.month)
    // submitData.append('year', formData.year)
    // submitData.append('month', formData.month)

    // Submit the form
    router.post(route('hr.monthly-salary.bulkStore'), submitData, {
      forceFormData: true,
      onSuccess: (page) => {
        setIsSubmitting(false);
        const error = page?.props?.flash?.error;
        let failedData = false;
        if (error) {
          const errorArray = error.split("employee_create_failed");
          if (errorArray.length > 1) {
            failedData = true;
            window.open(errorArray[1], '_blank', 'noopener,noreferrer');
          }
        }
        if (page.props.flash.success) {
          toast.success(t(page.props.flash.success));
          router.get(route('hr.monthly-salary.index'));
        } else if (failedData) {
          toast.info(t("Some record failed to upload. please check in failed excel report"));
        } else if (page.props.flash.error) {
          toast.error(t(page.props.flash.error));
        }
      },
      onError: (errors) => {
        setIsSubmitting(false);
        setErrors(errors);

        toast.error(t('Please correct the errors in the form'));
      }
    });
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Payroll Management'), href: route('hr.monthly-salary.index') },
    { title: t('Monthly Salary Settlement'), href: route('hr.monthly-salary.index') },
    { title: t('Add Monthly Salary Settlement') }
  ];

  const months = getMonths(t);

  return (
    <PageTemplate
      title={t("Add Monthly Salary Settlement")}
      url="/hr/create-bulk"
      breadcrumbs={breadcrumbs}
      actions={[
        {
          label: t('Back to Monthly Salary Settlement'),
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
          variant: 'outline',
          onClick: () => router.get(route('hr.monthly-salary.index'))
        }
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">{t('Year')}</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleChange('year', value)}
                >
                  <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('Select Year')} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      years.map((year, index) => {
                        return <SelectItem key={index} value={year.value}>{year.label}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">{t('Month')}</Label>
                <Select
                  value={formData.month}
                  onValueChange={(value) => handleChange('month', value)}
                >
                  <SelectTrigger className={errors.month ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('Select Month')} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      months.map((month, index) => {
                        return <SelectItem key={index} value={month.value}>{month.label}</SelectItem>
                      })
                    }
                  </SelectContent>
                </Select>
                {errors.month && <p className="text-red-500 text-xs">{errors.month}</p>}
              </div>
            </div>
            {/* Hidden file input */}
            <input
              id="bulk_file"
              type="file"
              accept=",.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setBulkFile(e.target.files[0]);
                  if (errors['bulk_file']) {
                    setErrors(prev => {
                      const n = { ...prev };
                      delete n['bulk_file'];
                      return n;
                    });
                  }
                }
              }}
              className="hidden"
            />

            {/* Row 2: Buttons left & right */}
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  (document.getElementById('bulk_file') as HTMLInputElement | null)?.click()
                }
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('Upload')}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  (globalThis as any).location.href = route('hr.monthly-salary.download-template');
                }}
              >
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
            onClick={() => router.get(route('hr.monthly-salary.index'))}
          >
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('Saving...') : t('Save Monthly Salary Settlement')}
          </Button>
        </div>
      </form>
    </PageTemplate>
  );
}