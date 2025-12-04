// pages/hr/employees/create.tsx
import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';
import { getImagePath } from '@/utils/helpers';

export default function EmployeeCreate() {
  const { t } = useTranslation();
  const { branches, departments, designations, documentTypes, shifts, attendancePolicies } = usePage().props as any;
  
  // State
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    employee_id: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    branch_id: '',
    department_id: '',
    designation_id: '',
    shift_id: '',
    attendance_policy_id: '',
    date_of_joining: '',
    employment_type: 'Full-time',
    employment_status: 'active',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_number: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    bank_identifier_code: '',
    bank_branch: '',
    tax_payer_id: '',
    documents: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  // Filter departments based on selected branch
  const filteredDepartments = formData.branch_id
    ? departments.filter((dept: any) => dept.branch_id === parseInt(formData.branch_id))
    : departments;
  
  // Filter designations based on selected department
  const filteredDesignations = formData.department_id
    ? designations.filter((desig: any) => desig.department_id === parseInt(formData.department_id))
    : designations;
  
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
    
    // Handle branch change - reset department and designation
    if (name === 'branch_id') {
      setFormData(prev => ({ 
        ...prev, 
        branch_id: value,
        department_id: '',
        designation_id: ''
      }));
    }
    
    // Handle department change - reset designation
    if (name === 'department_id') {
      setFormData(prev => ({ 
        ...prev, 
        department_id: value,
        designation_id: ''
      }));
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      
      // Clear error
      if (errors['profile_image']) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['profile_image'];
          return newErrors;
        });
      }
    }
  };
  
  const handleDocumentChange = (index: number, field: string, value: any) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setFormData(prev => ({ ...prev, documents: updatedDocuments }));
    
    // Clear error
    const errorKey = `documents.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };
  
  const handleDocumentFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleDocumentChange(index, 'file', file);
    }
  };
  
  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        { document_type_id: '', file: null, expiry_date: '' }
      ]
    }));
  };
  
  const removeDocument = (index: number) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    setFormData(prev => ({ ...prev, documents: updatedDocuments }));
    
    // Clear errors for this document
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`documents.${index}.`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create form data for submission
    const submitData = new FormData();
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'documents') {
        if (value !== null && value !== undefined && value !== '') {
          submitData.append(key, value);
        }
      }
    });
    
    // Add profile image if selected
    if (profileImage) {
      submitData.append('profile_image', profileImage);
    }
    
    // Add documents
    formData.documents.forEach((doc: any, index: number) => {
      if (doc.document_type_id) {
        submitData.append(`documents[${index}][document_type_id]`, doc.document_type_id);
      }
      if (doc.file_path) {
        submitData.append(`documents[${index}][file_path]`, doc.file_path);
      }
      if (doc.expiry_date) {
        submitData.append(`documents[${index}][expiry_date]`, doc.expiry_date);
      }
    });
    
    // Submit the form
    router.post(route('hr.employees.store'), submitData, {
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
      { title: t('Upload Employees') },
  ];

  return (
      <PageTemplate
          title={t('Upload Employees')}
          url="/hr/employees/create"
          breadcrumbs={breadcrumbs}
          actions={[
              {
                  label: t('Back to Employees'),
                  icon: <ArrowLeft className="mr-2 h-4 w-4" />,
                  variant: 'outline',
                  onClick: () => router.get(route('hr.employees.index')),
              },
          ]}
      >
          <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Card */}

              {/* Documents Card */}
              <Card>
                  <CardHeader>
                      <CardTitle>{t('Documents')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {formData.documents.map((document: any, index: number) => (
                          <div key={index} className="space-y-4 rounded-md border p-4">
                              <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium">
                                      {t('Document')} #{index + 1}
                                  </h3>
                                  <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                              </div>

                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                      <Label htmlFor={`document_type_${index}`}>
                                          {t('Document Type')} <span className="text-red-500">*</span>
                                      </Label>
                                      <Select
                                          value={document.document_type_id}
                                          onValueChange={(value) => handleDocumentChange(index, 'document_type_id', value)}
                                      >
                                          <SelectTrigger className={errors[`documents.${index}.document_type_id`] ? 'border-red-500' : ''}>
                                              <SelectValue placeholder={t('Select Document Type')} />
                                          </SelectTrigger>
                                          <SelectContent>
                                              {documentTypes.map((type: any) => (
                                                  <SelectItem key={type.id} value={type.id.toString()}>
                                                      {type.name} {type.is_required && <span className="text-red-500">*</span>}
                                                  </SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                      {errors[`documents.${index}.document_type_id`] && (
                                          <p className="text-xs text-red-500">{errors[`documents.${index}.document_type_id`]}</p>
                                      )}
                                  </div>

                                  <div className="space-y-2">
                                      <Label>
                                          {t('File')} <span className="text-red-500">*</span>
                                      </Label>
                                      <div className="flex flex-col gap-3">
                                          <div className="bg-muted/30 flex h-20 items-center justify-center rounded-md border p-4">
                                              {document.file_path ? (
                                                  <img
                                                      src={getImagePath(document.file_path)}
                                                      alt="Document Preview"
                                                      className="max-h-full max-w-full object-contain"
                                                  />
                                              ) : (
                                                  <div className="text-muted-foreground flex flex-col items-center gap-1">
                                                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded border border-dashed">
                                                          <span className="text-muted-foreground text-xs font-semibold">{t('Doc')}</span>
                                                      </div>
                                                      <span className="text-xs">No file selected</span>
                                                  </div>
                                              )}
                                          </div>
                                          <MediaPicker
                                              label=""
                                              value={document.file_path || ''}
                                              onChange={(url) => handleDocumentChange(index, 'file_path', url)}
                                              placeholder="Select document file..."
                                              showPreview={false}
                                          />
                                      </div>
                                      {errors[`documents.${index}.file`] && (
                                          <p className="text-xs text-red-500">{errors[`documents.${index}.file`]}</p>
                                      )}
                                  </div>

                                  <div className="space-y-2">
                                      <Label htmlFor={`document_expiry_${index}`}>{t('Expiry Date')}</Label>
                                      <Input
                                          id={`document_expiry_${index}`}
                                          type="date"
                                          value={document.expiry_date}
                                          onChange={(e) => handleDocumentChange(index, 'expiry_date', e.target.value)}
                                          className={errors[`documents.${index}.expiry_date`] ? 'border-red-500' : ''}
                                      />
                                      {errors[`documents.${index}.expiry_date`] && (
                                          <p className="text-xs text-red-500">{errors[`documents.${index}.expiry_date`]}</p>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}

                      <Button type="button" variant="outline" onClick={addDocument} className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          {t('Add Employee File')}
                      </Button>
                  </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.get(route('hr.employees.index'))}>
                      {t('Cancel')}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t('Saving...') : t('Save Employee')}
                  </Button>
              </div>
          </form>
      </PageTemplate>
  );
}