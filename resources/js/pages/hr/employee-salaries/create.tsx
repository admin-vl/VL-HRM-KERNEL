// pages/hr/employees/create.tsx
import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { MultiSelectField } from '@/components/multi-select-field';
import { Textarea } from '@/components/ui/textarea';

export default function EmployeeSalaryCreate() {
    const { t } = useTranslation();
    const { employees, recurringSalaryComponents, nonRecurringSalaryComponents } = usePage().props as any;

    // State
    const [formData, setFormData] = useState<Record<string, any>>({
        employee_id: '',
        basic_salary: '',
        is_active: false,
        notes: '',
        components: [],
        recurring_components_salary: [],
        nonrecurring_components: [],
        nonrecurring_components_salary: []
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (name: string, value: any) => {
        if (name === "components") {
            const prevValues = formData.components;

            const added = value.filter(v => !prevValues.includes(v));
            const removed = prevValues.filter(v => !value.includes(v));

            const recurring_components_salary: any = formData.recurring_components_salary || [];
            if (added && added.length > 0) {
                const component = recurringSalaryComponents.find(comp => comp.id == added[0]);
                if (component) {
                    const amount = component.calculation_type == "percentage" ? component.percentage_of_basic : component.default_amount
                    recurring_components_salary.push({ id: component.id, amount: amount, name: component.name, type: component.type, calculation_type: component.calculation_type })

                    setFormData(prev => ({ ...prev, recurring_components_salary: recurring_components_salary }));
                }
            }

            if (removed && removed.length > 0) {
                const remainingComponents = recurring_components_salary.filter(comp => comp.id != removed[0]);
                setFormData(prev => ({ ...prev, recurring_components_salary: remainingComponents }));
            }
        }

        if (name === "nonrecurring_components") {
            const prevValues = formData.nonrecurring_components;

            const added = value.filter(v => !prevValues.includes(v));
            const removed = prevValues.filter(v => !value.includes(v));

            const nonrecurring_components_salary: any = formData.nonrecurring_components_salary || [];
            if (added && added.length > 0) {
                const component = nonRecurringSalaryComponents.find(comp => comp.id == added[0]);
                if (component) {
                    const amount = component.calculation_type == "percentage" ? component.percentage_of_basic : component.default_amount
                    nonrecurring_components_salary.push({ id: component.id, amount: amount, name: component.name, type: component.type, calculation_type: component.calculation_type })

                    setFormData(prev => ({ ...prev, nonrecurring_components_salary: nonrecurring_components_salary }));
                }
            }

            if (removed && removed.length > 0) {
                const remainingComponents = nonrecurring_components_salary.filter(comp => comp.id != removed[0]);
                setFormData(prev => ({ ...prev, nonrecurring_components_salary: remainingComponents }));
            }
        }
        
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


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route('hr.employee-salaries.store'), formData, {
            onSuccess: (page) => {
                setIsSubmitting(false);
                if (page.props.flash.success) {
                    toast.success(t(page.props.flash.success));
                }
                router.get(route('hr.employee-salaries.index'));
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrors(errors);

                toast.error(t('Please correct the errors in the form'));
            }
        });
    };

    // const breadcrumbs = [
    //     { title: t('Dashboard'), href: route('dashboard') },
    //     { title: t('HR Management'), href: route('hr.employee-salaries.index') },
    //     { title: t('Employees'), href: route('hr.employee-salaries.index') },
    //     { title: t('Create Employee') }
    // ];
    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Payroll Management'), href: route('hr.employee-salaries.index') },
        { title: t('Employee Salaries'), href: route('hr.employee-salaries.index') },
        { title: t('Create Employee Salary') }
    ];

    const handleNonRecurringComponentChange = (amount: any, row: any) => {
        setFormData(prev => ({ ...prev, nonrecurring_components_salary: prev.nonrecurring_components_salary.map(item => item.id == row.id ? ({...item, amount }) : item) }));
    }

    const handleRecurringComponentChange = (amount: any, row: any) => {
        setFormData(prev => ({ ...prev, recurring_components_salary: prev.recurring_components_salary.map(item => item.id == row.id ? ({...item, amount }) : item) }));
    }

    return (
        <PageTemplate
            title={t("Create Employee Salary")}
            url="/hr/employee-salaries/create"
            breadcrumbs={breadcrumbs}
            actions={[
                {
                    label: t('Back to Employee Salary'),
                    icon: <ArrowLeft className="h-4 w-4 mr-2" />,
                    variant: 'outline',
                    onClick: () => router.get(route('hr.employee-salaries.index'))
                }
            ]}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Basic Information')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">{t('Employee')}</Label>
                                <Select
                                    value={formData.employee_id}
                                    onValueChange={(value) => handleChange('employee_id', value)}
                                >
                                    <SelectTrigger className={errors.employee_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={t('Select Employee')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp: any) => (
                                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                                {emp.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.employee_id && <p className="text-red-500 text-xs">{errors.employee_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="basic_salary">{t('Basic Salary')} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="basic_salary"
                                    type='number'
                                    value={formData.basic_salary}
                                    onChange={(e) => handleChange('basic_salary', e.target.value)}
                                    className={errors.basic_salary ? 'border-red-500' : ''}
                                />
                                {errors.basic_salary && <p className="text-red-500 text-xs">{errors.basic_salary}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">{t('Notes')}</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    placeholder={t("Supporting text for your headline")}
                                    rows={3}
                                    className="border-gray-200 resize-none"
                                // style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                                />
                                {/* <Input
                                    id="notes"
                                    type='textarea'
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    className={errors.notes ? 'border-red-500' : ''}
                                /> */}
                                {errors.notes && <p className="text-red-500 text-xs">{errors.notes}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="is_active">{t('Is Active')} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="is_active"
                                    type="checkbox"
                                    checked={formData.is_active ?? true}
                                    // onChange={(e) => handleChange('is_active', e.target.value)}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                                    className="h-4 w-4"
                                />
                                {/* <Label>Enable Login</Label>
                                <Input
                                    type="checkbox"
                                    name="login_enabled"
                                    checked={formData.login_enabled ?? true}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, login_enabled: e.target.checked }))}
                                    className="h-4 w-4" // <-- smaller checkbox
                                /> */}
                                {errors.is_active && <p className="text-red-500 text-xs">{errors.is_active}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Employment Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Recurring Salary Components')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="components">{t('Recurring Salary Components')}</Label>
                                <MultiSelectField
                                    field={{
                                        name: 'components',
                                        label: t('Recurring Salary Components'),
                                        type: 'multi-select',
                                        options: recurringSalaryComponents && recurringSalaryComponents
                                            .map((salComp: any) => ({
                                                value: salComp.id.toString(),
                                                label: `${salComp.name} (${salComp.type}) - ${salComp.calculation_type === 'percentage' ? salComp.percentage_of_basic + '%' : 'Rs.' + salComp.default_amount}`
                                            })),
                                        // helpText: t('Select departments for this training type')
                                    }}
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                                {errors.components && <p className="text-red-500 text-xs">{errors.components}</p>}
                            </div>


                            {/* <div className="space-y-2">
                                <Label htmlFor="grade">{t('Grade')}</Label>
                                <Input
                                    id="grade"
                                    value={formData.grade}
                                    onChange={(e) => handleChange('grade', e.target.value)}
                                    className={errors.grade ? 'border-red-500' : ''}
                                />
                                {errors.grade && <p className="text-red-500 text-xs">{errors.grade}</p>}
                            </div> */}

                        </div>
                        {
                            formData.components && formData.components.length > 0
                            &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {
                                    formData.recurring_components_salary.map((item: any, index: number) => {
                                        return <div className="space-y-2" key={`rec_${index}`}>
                                            <Label htmlFor={`recurring_components_salary_${item.id}`}>{`${item.name} (${item.type}) ${item.calculation_type == 'percentage' ? '%' : 'Rs'}`}</Label>
                                            <Input
                                                id={`recurring_components_salary_${item.id}`}
                                                value={item.amount ?? ''}
                                                // readOnly
                                                onChange={(e) => handleRecurringComponentChange(e.target.value, item)}
                                                className={errors.grade ? 'border-red-500' : ''}
                                            />
                                            {errors.grade && <p className="text-red-500 text-xs">{errors.grade}</p>}
                                        </div>
                                    })
                                }

                            </div>
                        }
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade">{t('Grade')}</Label>
                                <Input
                                    id="grade"
                                    value={formData.grade}
                                    onChange={(e) => handleChange('grade', e.target.value)}
                                    className={errors.grade ? 'border-red-500' : ''}
                                />
                                {errors.grade && <p className="text-red-500 text-xs">{errors.grade}</p>}
                            </div>

                        </div> */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('Non Recurring Salary Components')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nonrecurring_components">{t('Recurring Salary Components')}</Label>
                                <MultiSelectField
                                    field={{
                                        name: 'nonrecurring_components',
                                        label: t('Non Recurring Salary Components'),
                                        type: 'multi-select',
                                        options: nonRecurringSalaryComponents
                                            .map((salComp: any) => ({
                                                value: salComp.id.toString(),
                                                label: `${salComp.name} (${salComp.type}) - ${salComp.calculation_type === 'percentage' ? salComp.percentage_of_basic + '%' : 'Rs.' + salComp.default_amount}`
                                            })),
                                        // helpText: t('Select departments for this training type')
                                    }}
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                                {errors.nonrecurring_components && <p className="text-red-500 text-xs">{errors.nonrecurring_components}</p>}
                            </div>

                        </div>
                        {
                            formData.nonrecurring_components && formData.nonrecurring_components.length > 0
                            &&
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {
                                    formData.nonrecurring_components_salary.map((item: any, index: number) => {
                                        return <div className="space-y-2" key={`rec_${index}`}>
                                            <Label htmlFor={`nonrecurring_components_salary_${item.id}`}>{`${item.name} (${item.type}) ${item.calculation_type == 'percentage' ? '%' : 'Rs'}`}</Label>
                                            <Input
                                                id={`nonrecurring_components_salary_${item.id}`}
                                                value={item.amount ?? ''}
                                                onChange={(e) => handleNonRecurringComponentChange(e.target.value, item)}
                                                className={errors.grade ? 'border-red-500' : ''}
                                            />
                                            {errors.grade && <p className="text-red-500 text-xs">{errors.grade}</p>}
                                        </div>
                                    })
                                }

                            </div>
                        }
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.get(route('hr.employee-salaries.index'))}
                    >
                        {t('Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('Saving...') : t('Save Employee Salary')}
                    </Button>
                </div>
            </form>
        </PageTemplate>
    );
}