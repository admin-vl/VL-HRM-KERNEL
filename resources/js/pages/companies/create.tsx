import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';

export default function CreateCompany() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        tel: '',
        pan: '',
        tan: '',
        pf_code: '',
        esi_code: '',
        ptax_no: '',
        statutory_rates: '',
        company_logo: null,

        sign_name: '',
        sign_designation: '',
        sign_father_name: '',
        sign_address: '',
        sign_pan: '',
        sign_adhar: '',
        sign_dob: '',
        sign_email: '',
        sign_mobile: '',
        employee_code: '',
        // ...existing fields
        login_enabled: true,
        password: '',
    });

    const breadcrumbs = [{ title: 'Dashboard' }, { title: 'Companies', href: route('companies.index') }, { title: 'Create Company' }];

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        const key = name as keyof typeof formData; // <-- tell TS this is a valid key

        setFormData((prev) => ({
            ...prev,
            [key]: files ? files[0] : value,
        }));
    };

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return; // PREVENT double submission
    setIsSubmitting(true);

    const payload = new FormData();
    const status = formData.login_enabled ? 'active' : 'inactive';

    payload.append('status', status);

    Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key] ?? '');
    });

    router.post(route('companies.store'), payload, {
        onSuccess: () => {
            setIsSubmitting(false);
            router.visit(route('companies.index'));
        },
        onError: () => {
            setIsSubmitting(false);
        },
        onFinish: () => setIsSubmitting(false),
    });
};


    return (
        <PageTemplate
            title="Create Company"
            url="/companies/create"
            breadcrumbs={breadcrumbs}
            actions={[
                {
                    label: 'Back',
                    icon: <ArrowLeft className="mr-2 h-4 w-4" />,
                    variant: 'outline',
                    onClick: () => router.get(route('companies.index')),
                },
            ]}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ============================
            Company Master Section
        ============================= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Master</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Name */}
                        <div>
                            <Label>Company Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <Input name="email" value={formData.email} onChange={handleChange} type="email" required />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <Label>Address</Label>
                            <Input name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Telephone</Label>
                            <Input name="tel" value={formData.tel} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>PAN</Label>
                            <Input name="pan" value={formData.pan} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>TAN</Label>
                            <Input name="tan" value={formData.tan} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>PF Code</Label>
                            <Input name="pf_code" value={formData.pf_code} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>ESI Code</Label>
                            <Input name="esi_code" value={formData.esi_code} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Professional Tax Number</Label>
                            <Input name="ptax_no" value={formData.ptax_no} onChange={handleChange} />
                        </div>

                        <div className="md:col-span-2">
                            <Label>Statutory Rates (PF/ESI)</Label>
                            <Input name="statutory_rates" value={formData.statutory_rates} onChange={handleChange} />
                        </div>

                        <div className="md:col-span-2">
                            <Label>Company Logo</Label>
                            <Input type="file" name="company_logo" onChange={handleChange} accept="image/*" />
                        </div>
                    </CardContent>
                </Card>

                {/* ============================
            Signatory Details Section
        ============================= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Signatory Details</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Name</Label>
                            <Input name="sign_name" value={formData.sign_name} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Designation</Label>
                            <Input name="sign_designation" value={formData.sign_designation} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Father Name</Label>
                            <Input name="sign_father_name" value={formData.sign_father_name} onChange={handleChange} />
                        </div>

                        <div className="md:col-span-2">
                            <Label>Address</Label>
                            <Input name="sign_address" value={formData.sign_address} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>PAN</Label>
                            <Input name="sign_pan" value={formData.sign_pan} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Aadhaar</Label>
                            <Input name="sign_adhar" value={formData.sign_adhar} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Date of Birth</Label>
                            <Input type="date" name="sign_dob" value={formData.sign_dob} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input name="sign_email" value={formData.sign_email} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Mobile</Label>
                            <Input name="sign_mobile" value={formData.sign_mobile} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Employee Code</Label>
                            <Input name="employee_code" value={formData.employee_code} onChange={handleChange} />
                        </div>
                    </CardContent>
                </Card>
                {/* ============================
    Login Settings Section
============================= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Login Settings</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Enable Login Switch */}
                        <div className="flex items-center space-x-2">
                            <Label>Enable Login</Label>
                            <Input
                                type="checkbox"
                                name="login_enabled"
                                checked={formData.login_enabled ?? true}
                                onChange={(e) => setFormData((prev) => ({ ...prev, login_enabled: e.target.checked }))}
                                className="h-4 w-4" // <-- smaller checkbox
                            />
                        </div>

                        {/* Password - only show if login_enabled is true */}
                        {formData.login_enabled && (
                            <div>
                                <Label>Password</Label>
                                <Input type="password" name="password" value={formData.password ?? ''} onChange={handleChange} required />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submit */}
                <Button type="submit">Save Company</Button>
            </form>
        </PageTemplate>
    );
}
