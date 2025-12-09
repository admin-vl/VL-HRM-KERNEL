<?php

namespace App\Http\Controllers;

use App\Models\CompanyInfo;
use App\Models\User;
use App\Models\Plan;
use App\Models\PlanOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function create()
    {
        return Inertia::render('companies/create', [
            'plans' => Plan::all()
        ]);
    }

    public function index(Request $request)
    {
        $query = User::query()
            ->where('type', 'company')
            ->with(['plan', 'companyInfo']); // <-- added companyInfo relation

        // Apply search filter
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhereHas('companyInfo', function ($info) use ($request) {
                        $info->where('company_name', 'like', "%{$request->search}%")
                            ->orWhere('contact_person', 'like', "%{$request->search}%");
                    });
            });
        }

        // Apply status filter
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Date filters
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $companies = $query->paginate($perPage)->withQueryString();

        // Format data
        $companies->getCollection()->transform(function ($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'status' => $company->status,
                'created_at' => $company->created_at,
                'plan_name' => $company->plan->name ?? __('No Plan'),
                'plan_expiry_date' => $company->plan_expire_date,
                'appointments_count' => 0,

                'company_logo' => $company->companyInfo->company_logo
                    ? asset('storage/' . $company->companyInfo->company_logo)
                    : null,

                'company_info' => [
                    'company_name' => $company->companyInfo->company_name ?? null,
                    'email' => $company->companyInfo->email ?? null,
                    'phone' => $company->companyInfo->phone ?? null,
                    'address' => $company->companyInfo->address ?? null,
                    'city' => $company->companyInfo->city ?? null,
                    'state' => $company->companyInfo->state ?? null,
                    'country' => $company->companyInfo->country ?? null,
                    'pincode' => $company->companyInfo->pincode ?? null,
                    'contact_person' => $company->companyInfo->contact_person ?? null,
                    'gst_number' => $company->companyInfo->gst_number ?? null,
                    'website' => $company->companyInfo->website ?? null,
                ]
            ];
        });

        // Plans for dropdown
        $plans = Plan::all(['id', 'name']);

        return Inertia::render('companies/index', [
            'companies' => $companies,
            'plans' => $plans,
            'filters' => $request->only([
                'search',
                'status',
                'start_date',
                'end_date',
                'sort_field',
                'sort_direction',
                'per_page'
            ])
        ]);
    }

    public function edit($id)
    {
        $company = User::with('companyInfo')->findOrFail($id);

        return Inertia::render('companies/EditCompany', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'status' => $company->status,

                // Company Info
                'address' => $company->companyInfo->address ?? '',
                'tel' => $company->companyInfo->tel ?? '',
                'pan' => $company->companyInfo->pan ?? '',
                'tan' => $company->companyInfo->tan ?? '',
                'pf_code' => $company->companyInfo->pf_code ?? '',
                'esi_code' => $company->companyInfo->esi_code ?? '',
                'ptax_no' => $company->companyInfo->ptax_no ?? '',
                'statutory_rates' => $company->companyInfo->statutory_rates ?? '',
                'company_logo' => $company->companyInfo->company_logo ?? '',

                // Signatory
                'sign_name' => $company->companyInfo->sign_name ?? '',
                'sign_designation' => $company->companyInfo->sign_designation ?? '',
                'sign_father_name' => $company->companyInfo->sign_father_name ?? '',
                'sign_address' => $company->companyInfo->sign_address ?? '',
                'sign_pan' => $company->companyInfo->sign_pan ?? '',
                'sign_adhar' => $company->companyInfo->sign_adhar ?? '',
                'sign_dob' => $company->companyInfo->sign_dob ?? '',
                'sign_email' => $company->companyInfo->sign_email ?? '',
                'sign_mobile' => $company->companyInfo->sign_mobile ?? '',
                'employee_code' => $company->companyInfo->employee_code ?? '',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:active,inactive',

            // COMPANY INFO FIELDS
            'address' => 'nullable|string',
            'tel' => 'nullable|string',
            'pan' => 'nullable|string',
            'tan' => 'nullable|string',
            'pf_code' => 'nullable|string',
            'esi_code' => 'nullable|string',
            'ptax_no' => 'nullable|string',
            'statutory_rates' => 'nullable|string',
            'company_logo' => 'nullable|image',

            'sign_name' => 'nullable|string',
            'sign_designation' => 'nullable|string',
            'sign_father_name' => 'nullable|string',
            'sign_address' => 'nullable|string',
            'sign_pan' => 'nullable|string',
            'sign_adhar' => 'nullable|string',
            'sign_dob' => 'nullable|date',
            'sign_email' => 'nullable|string|email',
            'sign_mobile' => 'nullable|string',
            'employee_code' => 'nullable|string',
        ]);

        $company = new User();
        $company->name = $validated['name'];
        $company->email = $validated['email'];

        // Only set password if provided
        if (isset($validated['password'])) {
            $company->password = Hash::make($validated['password']);
        }

        $company->type = 'company';
        $company->status = $validated['status'];

        // Set company language same as creator (superadmin)
        $creator = auth()->user();
        if ($creator && $creator->lang) {
            $company->lang = $creator->lang;
        }

        // Assign default plan
        $defaultPlan = Plan::where('is_default', true)->first();
        if ($defaultPlan) {
            $company->plan_id = $defaultPlan->id;

            // Set plan expiry date based on plan duration
            if ($defaultPlan->duration === 'yearly') {
                $company->plan_expire_date = now()->addYear();
            } else {
                $company->plan_expire_date = now()->addMonth();
            }

            // Set plan is active
            $company->plan_is_active = 1;
        }

        $company->save();

        // Assign role and settings to the user
        defaultRoleAndSetting($company);

        /* ----------------------------------
        2) HANDLE COMPANY LOGO UPLOAD
        ---------------------------------- */
        $logoPath = null;
        if ($request->hasFile('company_logo')) {
            $logoPath = $request->file('company_logo')->store('uploads/company_logos', 'public');
        }

        /* ----------------------------------
        3) CREATE COMPANY INFO RECORD
 ---------------------------------- */

        CompanyInfo::create([
            'user_id' => $company->id,
            'company_name' => $request->name,
            'address' => $request->address,
            'email' => $request->email,
            'tel' => $request->tel,
            'pan' => $request->pan,
            'tan' => $request->tan,
            'pf_code' => $request->pf_code,
            'esi_code' => $request->esi_code,
            'ptax_no' => $request->ptax_no,
            'statutory_rates' => $request->statutory_rates,
            'company_logo' => $logoPath,

            'sign_name' => $request->sign_name,
            'sign_designation' => $request->sign_designation,
            'sign_father_name' => $request->sign_father_name,
            'sign_address' => $request->sign_address,
            'sign_pan' => $request->sign_pan,
            'sign_adhar' => $request->sign_adhar,
            'sign_dob' => $request->sign_dob,
            'sign_email' => $request->sign_email,
            'sign_mobile' => $request->sign_mobile,

            'employee_code' => $request->employee_code,
        ]);

        /* ----------------------------------
        4) EMAIL EVENT
        ---------------------------------- */

        // Trigger email notification
        event(new \App\Events\UserCreated($company, $validated['password'] ?? ''));

        // Check for email errors
        if (session()->has('email_error')) {
            return redirect()->back()->with('warning', __('Company created successfully, but welcome email failed: ') . session('email_error'));
        }

        return redirect()
            ->route('companies.index')
            ->with('success', 'Company created successfully');

    }

    public function update(Request $request, $id)
    {
        $company = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            // 'password' => 'nullable|string|min:8',
            // 'status' => 'required|in:active,inactive',

            // Company info
            'address' => 'nullable|string',
            'tel' => 'nullable|string',
            'pan' => 'nullable|string',
            'tan' => 'nullable|string',
            'pf_code' => 'nullable|string',
            'esi_code' => 'nullable|string',
            'ptax_no' => 'nullable|string',
            'statutory_rates' => 'nullable|string',
            'company_logo' => 'nullable|image',

            // Signatory
            'sign_name' => 'nullable|string',
            'sign_designation' => 'nullable|string',
            'sign_father_name' => 'nullable|string',
            'sign_address' => 'nullable|string',
            'sign_pan' => 'nullable|string',
            'sign_adhar' => 'nullable|string',
            'sign_dob' => 'nullable|date',
            'sign_email' => 'nullable|email',
            'sign_mobile' => 'nullable|string',
            'employee_code' => 'nullable|string',
        ]);

        // Update base user
        $company->name = $validated['name'];
        $company->email = $validated['email'];
        // $company->status = $validated['status'];

        // if (!empty($validated['password'])) {
        //     $company->password = Hash::make($validated['password']);
        // }

        $company->save();

        /* -------------- LOGO Upload --------------- */
        $logoPath = $company->companyInfo->company_logo ?? null;

        if ($request->hasFile('company_logo')) {
            $logoPath = $request->file('company_logo')->store('uploads/company_logos', 'public');
        }

        /* -------------- Update CompanyInfo --------------- */
        $company->companyInfo()->update([
            'company_name' => $request->name,
            'address' => $request->address,
            'email' => $request->email,
            'tel' => $request->tel,
            'pan' => $request->pan,
            'tan' => $request->tan,
            'pf_code' => $request->pf_code,
            'esi_code' => $request->esi_code,
            'ptax_no' => $request->ptax_no,
            'statutory_rates' => $request->statutory_rates,
            'company_logo' => $logoPath,

            'sign_name' => $request->sign_name,
            'sign_designation' => $request->sign_designation,
            'sign_father_name' => $request->sign_father_name,
            'sign_address' => $request->sign_address,
            'sign_pan' => $request->sign_pan,
            'sign_adhar' => $request->sign_adhar,
            'sign_dob' => $request->sign_dob,
            'sign_email' => $request->sign_email,
            'sign_mobile' => $request->sign_mobile,
            'employee_code' => $request->employee_code,
        ]);

        return redirect()
            ->route('companies.index')
            ->with('success', 'Company updated successfully');
    }


    public function destroy(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }

        $company->delete();

        return redirect()->back()->with('success', __('Company deleted successfully'));
    }

    public function resetPassword(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $company->password = Hash::make($validated['password']);
        $company->save();

        return redirect()->back()->with('success', __('Password reset successfully'));
    }

    public function toggleStatus(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }

        $company->status = $company->status === 'active' ? 'inactive' : 'active';
        $company->save();

        return redirect()->back()->with('success', __('Company status updated successfully'));
    }

    /**
     * Get available plans for upgrade
     */
    public function getPlans(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return response()->json(['error' => __('Invalid company record')], 400);
        }

        $plans = Plan::where('is_plan_enable', 'on')->get();

        $formattedPlans = [];

        foreach ($plans as $plan) {
            // Format features using same logic as PlanController
            $features = [];
            if ($plan->features) {
                $enabledFeatures = $plan->getEnabledFeatures();
                $featureLabels = [
                    'ai_integration' => __('AI Integration'),
                    'password_protection' => __('Password Protection')
                ];
                foreach ($enabledFeatures as $feature) {
                    if (isset($featureLabels[$feature])) {
                        $features[] = $featureLabels[$feature];
                    }
                }
            } else {
                if ($plan->enable_chatgpt === 'on')
                    $features[] = __('AI Integration');
            }

            // Monthly plan
            $formattedPlans[] = [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $plan->price,
                'duration' => 'Monthly',
                'description' => $plan->description,
                'features' => $features,
                'max_employees' => $plan->max_employees,
                'max_users' => $plan->max_users,
                'storage_limit' => $plan->storage_limit . ' ' . __('GB'),
                'is_current' => $company->plan_id === $plan->id,
                'is_default' => $plan->is_default
            ];

            // Yearly plan (create a separate entry)
            $yearlyPrice = $plan->yearly_price ?? ($plan->price * 12 * 0.8);
            $formattedPlans[] = [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $yearlyPrice,
                'duration' => 'Yearly',
                'description' => $plan->description,
                'features' => $features,
                'max_employees' => $plan->max_employees,
                'max_users' => $plan->max_users,
                'storage_limit' => $plan->storage_limit . ' ' . __('GB'),
                'is_current' => $company->plan_id === $plan->id,
                'is_default' => $plan->is_default
            ];
        }

        return response()->json([
            'plans' => $formattedPlans,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'current_plan_id' => $company->plan_id
            ]
        ]);
    }


    public function upgradePlan(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return back()->with('error', __('Invalid company record'));
        }

        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'duration' => 'required|in:yearly,monthly',
        ]);

        $plan = Plan::find($validated['plan_id']);
        if (!$plan) {
            return back()->with('error', __('Plan not found'));
        }

        $isYearly = $validated['duration'] === 'Yearly';

        // Create plan order entry for tracking
        $planOrder = new PlanOrder();
        $planOrder->user_id = $company->id;
        $planOrder->plan_id = $plan->id;
        $planOrder->billing_cycle = $request->duration === 'yearly' ? 'yearly' : 'monthly';
        $planOrder->original_price = $request->duration === 'yearly' ? ($plan->yearly_price ?? 0) : $plan->price;
        $planOrder->discount_amount = 0;
        $planOrder->final_price = $planOrder->original_price;
        $planOrder->payment_method = 'admin_upgrade';
        $planOrder->status = 'approved';
        $planOrder->ordered_at = now();
        $planOrder->processed_at = now();
        $planOrder->processed_by = auth()->id();
        $planOrder->notes = 'Plan upgraded by super admin';
        $planOrder->save();
        // Update company plan
        $company->plan_id = $plan->id;

        // Set plan expiry date based on plan duration
        if ($plan->duration === 'yearly') {
            $company->plan_expire_date = now()->addYear();
        } else {
            $company->plan_expire_date = now()->addMonth();
        }

        // Set plan is active
        $company->plan_is_active = 1;

        $company->save();

        return back()->with('success', __('Plan upgraded successfully'));
    }

    // Business links method removed
}
