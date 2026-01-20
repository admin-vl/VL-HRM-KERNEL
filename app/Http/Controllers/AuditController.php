<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index(Request $request)
    {
        // dd([
        //     'roles' => auth()->user()->getRoleNames(),
        //     'permissions' => auth()->user()->getAllPermissions()->pluck('name')
        // ]);
        // dd(auth()->user()->getRoleNames());
        // dd(getCompanyAndUsersId());
        $query = Audit::with('user')->whereIn('user_id', getCompanyAndUsersId());
        // withPermissionCheck();

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $query->where('event', 'like', '%' . $request->search . '%');
        }

        if ($request->has('user') && $request->user !== 'all') {
            $query->where('user_id', $request->user);
        }

        if ($request->has('event') && $request->event !== 'all') {
            $query->where('event', $request->event);
        }

        // Handle sorting
        if ($request->has('sort_field') && !empty($request->sort_field)) {
            $query->orderBy($request->sort_field, $request->sort_direction ?? 'asc');
        } else {
            $query->orderBy('id', 'desc');
        }

        $audits = $query->paginate($request->per_page ?? 10);

        // dd($audits);

        $users = User::whereIn('id', getCompanyAndUsersId())->get();

        return Inertia::render('audit/index', [
            'audits' => $audits,
            'users' => $users,
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }
}
