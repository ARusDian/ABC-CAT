<?php

namespace App\Http\Controllers;

use App\Exports\ExamResultExport;
use App\Exports\UsersExport;
use App\Exports\UsersTemplateExport;
use App\Imports\UsersImport;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = User::withTrashed()
            ->with('roles')
            ->whereColumns($request->get('columnFilters'))
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return Inertia::render('Admin/User/Index', [
            'users' => $user,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        $roles = Role::all();
        return Inertia::render('Admin/User/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'roles.*.id' => 'required|exists:roles',
                'phone_number' => 'required|string',
                'photo.file' => 'nullable|max:2048',
                'address' => 'required|string',
                'gender' => 'required|in:L,P',
            ]);
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone_number' => $validated['phone_number'],
                'active_year' => date('Y'),
                'address' => $validated['address'],
                'gender' => $validated['gender'],
            ]);

            if (isset($request['photo']['file'])) {
                $user->updateProfilePhoto($request['photo']['file']);
            }

            foreach ($validated['roles'] as $role) {
                $user->assignRole($role['id']);
            }
            activity()
                ->performedOn($user)
                ->causedBy(Auth::user())
                ->withProperties(['method' => 'CREATE'])
                ->log('Created User ' . $user->name . '');

            return redirect()
                ->route('user.index')
                ->banner('New User Created Successfully');
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $user = User::withTrashed()
            ->with(['roles'])
            ->find($id);
        return Inertia::render('Admin/User/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $user = User::withTrashed()
            ->with(['roles'])
            ->find($id);
        $roles = Role::all();
        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        return DB::transaction(function () use ($request, $id) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|',
                'password' => 'nullable|string|min:8',
                'roles.*.id' => 'required|exists:roles',
                'phone_number' => 'required|string',
                'active_year' => 'required|numeric',
                'photo' => 'nullable|max:2048',
                'photo_profile_path' => 'nullable|string',
                'address' => 'required|string',
                'gender' => 'required|in:L,P',
            ]);

            $user = User::findOrFail($id);
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'active_year' => $validated['active_year'],
                'address' => $validated['address'],
                'gender' => $validated['gender'],
            ]);

            if (isset($request['photo']['file'])) {
                $user->updateProfilePhoto($request['photo']['file']);
            }

            if (isset($validated['password'])) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }
            $user->syncRoles($validated['roles'] ?? []);
            $user->save();
            activity()
                ->performedOn($user)
                ->causedBy(Auth::user())
                ->withProperties(['method' => 'UPDATE'])
                ->log('Updated User ' . $user->name . '');
            return redirect()
                ->route('user.show', $id)
                ->banner('User Updated Successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $user = User::findOrFail($id);
        $user->delete();
        activity()
            ->performedOn($user)
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'DELETE'])
            ->log('Deleted User ' . $user->name . '');
        return redirect()
            ->route('user.index')
            ->banner('User Deleted Successfully');
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        activity()
            ->performedOn($user)
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'RESTORE'])
            ->log('Restored User ' . $user->name . '');
        return redirect()
            ->route('user.index')
            ->banner('User Restored Successfully');
    }

    public function ImportExportView()
    {
        return Inertia::render('Admin/User/ImportExport', []);
    }

    public function import(Request $request)
    {
        $request->validate([
            'import_file' => 'required',
        ]);
        Excel::import(
            new UsersImport(),
            $request->file('import_file.file')->store('temp'),
        );
        activity()
            ->performedOn(User::find(Auth::user()->id))
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'IMPORT'])
            ->log('Imported Users');
        return redirect()
            ->route('user.index')
            ->banner('User Imported Successfully');
    }

    public function export()
    {
        activity()
            ->performedOn(User::find(Auth::user()->id))
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'EXPORT'])
            ->log('Exported Users');
        return Excel::download(new UsersExport(), 'users.xlsx');
    }

    public function template()
    {
        return Excel::download(
            new UsersTemplateExport(),
            'users_template.xlsx',
        );
    }

    public function exportExamResult($id)
    {
        $user = User::find($id);
        $exams = Exam::where('user_id', $id)->with([
            'exerciseQuestion' => fn ($q) => $q->select('id', 'name', 'learning_category_id')->with([
                'learningCategory' => fn ($q) => $q->select('id', 'name', 'sub_learning_packet_id')->with([
                    'subLearningPacket' => fn ($q) => $q->select('id', 'name', 'learning_packet_id')->with([
                        'learningPacket' => fn ($q) => $q->select('id', 'name')
                    ])
                ])
            ]),
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])->withScore()->ofFinished(true)->get();

        activity()
            ->performedOn($user)
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'EXPORT'])
            ->log('Exported Exam Result');
        return Excel::download(
            new ExamResultExport($exams, "Hasil Latihan Pengguna " . $user->name . " - ". $user->email),
            'Hasil Ujian Pengguna.xlsx',
        );
    }
}
