import { toast } from '@/components/custom-toast';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function EditCompany() {
    const { company } = usePage().props as any;

    const [formData, setFormData] = useState({
        ...company,
        login_enabled: company.status === 'active',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = new FormData();


Object.keys(formData).forEach((key) => {
    if (key === "company_logo") {
        if (formData.company_logo instanceof File) {
            payload.append("company_logo", formData.company_logo);
        }
        return; // skip if not a File
    }

    payload.append(key, formData[key] ?? "");
});

        payload.append('_method', 'PUT');
        router.post(route('companies.update', company.id), payload, {
            forceFormData: true,
            onSuccess: (page) => {
                toast.dismiss();

                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                } else if (page.props.flash?.error) {
                    toast.error(page.props.flash.error);
                }
            },
            onError: (errors) => {
                toast.dismiss();

                if (typeof errors === 'string') {
                    toast.error(errors);
                } else {
                    toast.error(`Failed to update company: ${Object.values(errors).join(', ')}`);
                }
            },
        });
    };

    return (
        <PageTemplate
            title="Edit Company"
            url="/companies"
            breadcrumbs={[{ title: 'Dashboard' }, { title: 'Companies', href: route('companies.index') }, { title: 'Edit Company' }]}
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
                <Card>
                    <CardHeader>
                        <CardTitle>Company Master</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label>Company Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                        </div>

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
                            <Label>Statutory Rates</Label>
                            <Input name="statutory_rates" value={formData.statutory_rates} onChange={handleChange} />
                        </div>

                        <div className="md:col-span-2">
                            <Label>Company Logo</Label>
                            <Input type="file" name="company_logo" onChange={handleChange} />
                        </div>
                    </CardContent>
                </Card>

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
                            <Label>DOB</Label>
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

                <Button type="submit">Update Company</Button>
            </form>
        </PageTemplate>
    );
}
